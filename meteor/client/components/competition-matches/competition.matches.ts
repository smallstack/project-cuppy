/// <reference path="../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRoute("/competition/:competitionName")
    .setLabel("navigation.competition")
    .setRequiresAuthentication(false)
    .setTemplate("<competition-matches></competition-matches>")
    .setVisible(false)
    .setStateName("website.competition")
);

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRoute("/competition/:competitionName/rounds/:competitionRoundId")
    .setLabel("navigation.competitionRound")
    .setRequiresAuthentication(false)
    .setTemplate("<competition-matches></competition-matches>")
    .setVisible(false)
    .setStateName("website.competitionRound")
);


interface CompetitionScope extends angular.IScope {
    vm: CompetitionMatchesController;
    competition: Competition;
    loaded: boolean;
    selectedRound: CompetitionRound;
    isAdministrator: boolean;
    bets: Bet[];
    matches: CompetitionMatch[];
    currentMatch: CompetitionMatch;
    currentBetHome: number;
    currentBetAway: number;
    roundName: string;
    rounds: CompetitionRound[];
}


class CompetitionMatchesController extends AngularBaseComponentController implements InitializationAware {

    @Autowired
    private competitionMatchesService: CompetitionMatchesService;

    @Autowired
    private localizationService: LocalizationService;

    @Autowired
    private betsService: BetsService;

    @Autowired
    private competitionsService: CompetitionsService;

    @Autowired
    private competitionRoundsService: CompetitionRoundsService

    public afterInitialization() {
        this.$scope.loaded = false;

        if (this.$stateParams["competitionName"] === undefined) {
            NotificationService.instance().popup.error("No competition name given!");
            return;
        }

        this.loadCompetition(this.$stateParams["competitionName"], (competitionId: string) => {
            // get rounds
            var roundsQuery: QueryObject<CompetitionRound> = this.competitionRoundsService.getAllRoundsForCompetitionId({ competitionId: competitionId });
            roundsQuery.subscribe(() => {
                this.$scope.rounds = roundsQuery.val();

                var selectedRoundId: string = this.$stateParams["competitionRoundId"];

                // if competitionRound === current
                if (selectedRoundId === "current") {
                    var currentRound: CompetitionRound = _.find(this.$scope.rounds, (round: CompetitionRound) => !round.allMatchesFinished);
                    if (currentRound !== undefined)
                        selectedRoundId = currentRound.id;
                    else
                        selectedRoundId = undefined;
                }

                if (selectedRoundId === undefined)
                    this.$scope.roundName = "competition.allmatches";
                else {
                    this.$scope.selectedRound = _.find(this.$scope.rounds, (round: CompetitionRound) => round.id === selectedRoundId);
                    if (this.$scope.selectedRound)
                        this.$scope.roundName = this.$scope.selectedRound.name;
                }

                this.loadMatches(competitionId, selectedRoundId, (competitionId: string) => {
                    this.loadMyBets(competitionId, () => {
                        this.$timeout(() => {
                            this.$scope.loaded = true;
                        });
                    });
                });
            });
        });

        this.openModal = this.openModal.bind(this);
    }


    public loadCompetition(name: string, callback: (competitionId: string) => void) {
        // get the competition
        var competitionQuery: QueryObject<Competition> = this.competitionsService.getCompetitionByName({ name: name });
        competitionQuery.subscribe(() => {
            this.$scope.competition = competitionQuery.val(0);
            this.$scope.loaded = true;
            if (this.$scope.competition === undefined) {
                NotificationService.instance().popup.error("Competition not found : '" + name + "'!");
                return;
            }
            else {
                this.$scope.isAdministrator = this.$scope.competition.administratorIds.indexOf(Meteor.userId()) !== -1;
                callback(this.$scope.competition.id);
            }
        });
    }

    private loadMatches(competitionId: string, roundId: string, callback: (competitionId: string) => void) {
        var query: QueryObject<CompetitionMatch> = undefined;
        if (roundId === undefined)
            query = this.competitionMatchesService.getMatchesForCompetitionId({ competitionId: competitionId });
        else
            query = this.competitionMatchesService.getMatchesForCompetitionAndRound({ competitionId: competitionId, roundId: roundId });

        query.subscribe(() => {
            this.$timeout(() => {
                this.$scope.matches = query.val();
            });
            query.expand(["teamIds.linkedUserIds"], () => {
                callback(competitionId);
            });
        });
    }

    private loadMyBets(competitionId: string, callback: () => void) {
        this.$scope.bets = [];
        if (Meteor.userId()) {
            var query: QueryObject<Bet> = this.betsService.getBetsForCompetitionAndUserId({ 'competitionId': competitionId, 'userId': Meteor.userId() });
            query.subscribe(() => {
                _.each<Bet>(query.val(), (bet: Bet) => {
                    this.$scope.bets[bet.matchId] = bet;
                });
                callback();
            });
        }
        else
            callback();
    }

    public update(match: CompetitionMatch) {
        var self = this;
        if (match.result[0] && match.result[1]) {
            match.updateScores(function (error: Meteor.Error, result: boolean) {
                if (error) NotificationService.instance().getStandardErrorPopup(error, "Could not save match scores!");
                else {
                    if (result) {
                        NotificationService.instance().notification.success("Scores saved!");
                    }
                    else {
                        console.warn("Updating scores returned false!");
                    }
                }
            });
        }
    }

    public placeBet() {
        if (this.$scope.currentMatch) {
            this.$scope.currentMatch.placeBet(this.$scope.currentBetHome, this.$scope.currentBetAway, (error: Meteor.Error, betId: string) => {
                if (error)
                    this.notificationService.getStandardErrorPopup(error, "Could not update Bet!");
                else {
                    var betQuery: QueryObject<Bet> = this.betsService.getBetById({ id: betId });
                    betQuery.subscribe(() => {
                        this.$timeout(() => {
                            this.$scope.bets[this.$scope.currentMatch.id] = betQuery.val(0);
                            (<any>$("#betModal")).modal('hide');
                        });
                    });
                }
            });
        }
        else {
            this.notificationService.notification.error("No match opened for betting!");
        }
    }

    public saveCurrentMatch() {
        var currentMatch = this.$scope.currentMatch;
        if (currentMatch) {
            if (!(currentMatch.result instanceof Array) || typeof currentMatch.result[0] !== "number" || typeof currentMatch.result[1] !== "number")
                this.notificationService.popup.error("Could not save results since not both sides are given!");
            else {
                currentMatch.updateScores((error: Meteor.Error, result: boolean) => {
                    if (error)
                        this.notificationService.getStandardErrorPopup(error, "Could not save results!");
                    else {
                        this.$timeout(() => {
                            (<any>$("#matchEditModal")).modal('hide');
                            this.$scope.currentMatch = undefined;
                        });
                    }
                });
            }
        }
        else {
            this.notificationService.notification.error("No match opened for editing!");
        }
    }

    public resetCurrentScores() {
        var currentMatch = this.$scope.currentMatch;

        if (currentMatch) {
            currentMatch.resetScores((error: Meteor.Error, result: boolean) => {

                if (error)
                    this.notificationService.getStandardErrorPopup(error, "Could not reset results!");
                else {
                    this.$timeout(() => {
                        (<any>$("#matchEditModal")).modal('hide');

                        // reset that one match
                        _.each(this.$scope.matches, (match: CompetitionMatch) => {
                            if (match.id === currentMatch.id)
                                match.result = [];
                        });
                        this.$scope.currentMatch = undefined;
                    });
                }
            });
        }
        else {
            this.notificationService.notification.error("No match opened for editing!");
        }
    }

    public updateCurrentBet(resultIndex, delta) {
        if (resultIndex === 0)
            this.$scope.currentBetHome += delta;
        if (resultIndex === 1)
            this.$scope.currentBetAway += delta;
    }

    public updateCurrentMatch(resultIndex, delta) {
        if (!this.$scope.currentMatch.result)
            this.$scope.currentMatch.result = [];
        if (this.$scope.currentMatch.result[resultIndex] === undefined) {
            this.$scope.currentMatch.result[0] = 0;
            this.$scope.currentMatch.result[1] = 0;
        }
        else {
            this.$scope.currentMatch.result[resultIndex] += delta;
            if (this.$scope.currentMatch.result[resultIndex] < 0)
                this.$scope.currentMatch.result[resultIndex] = 0;
        }
    }

    public openMatchDetailPage(match: CompetitionMatch) {
        this.$state.go("website.matchDetail", { matchId: match.id, competitionName: this.$stateParams["competitionName"] });
    }

    public openModal(match: CompetitionMatch) {
        this.openMatchDetailPage(match);
        // if (Meteor.userId()) {
        //     this.$scope.currentMatch = match;
        //     if (this.$scope.isAdministrator)
        //         (<any>$("#adminModal")).modal();
        //     else {
        //         if (this.$scope.currentMatch.isBetable())
        //             this.openBetModal();
        //         else
        //             this.$state.go("website.matchDetail", { matchId: match.id, competitionName: this.$stateParams["competitionName"] });
        //     }
        // } else {
        //     NotificationService.instance().popup.error("You must be logged in before you can place a bet or watch the statistics!");
        // }
    }

    public openBetModal() {
        if (this.$scope.isAdministrator)
            (<any>$("#adminModal")).modal('hide');

        if (this.$scope.bets[this.$scope.currentMatch.id] === undefined) {
            this.$scope.currentBetHome = 0;
            this.$scope.currentBetAway = 0;
        } else {
            this.$scope.currentBetHome = this.$scope.bets[this.$scope.currentMatch.id].result[0];
            this.$scope.currentBetAway = this.$scope.bets[this.$scope.currentMatch.id].result[1];
        }

        (<any>$("#betModal")).modal();
    }

    public goToDetails(match: CompetitionMatch) {
        if (this.$scope.isAdministrator)
            (<any>$("#adminModal")).modal('hide');
        this.$timeout(() => {
            this.$state.go("website.matchDetail", { matchId: match.id, competitionName: this.$stateParams["competitionName"] });
        });
    }

    public openMatchEditModal() {
        if (this.$scope.isAdministrator)
            (<any>$("#adminModal")).modal('hide');
        (<any>$("#matchEditModal")).modal();
    }

    // public openSensationModal() {
    //     if (this.$scope.isAdministrator)
    //         (<any>$("#adminModal")).modal('hide');
    //     if (this.$scope.currentMatch.isFinished()) {
    //         this.$scope.sensationTags = this.$scope.currentMatch.getHomeTeam().getTeamName() + "," + this.$scope.currentMatch.getAwayTeam().getTeamName() + ",group";
    //         this.$scope.sensationKey = this.$scope.currentMatch.getHomeTeam().getTeamName() + " vs. " + this.$scope.currentMatch.getAwayTeam().getTeamName();
    //         (<any>$("#sensationModal")).modal();
    //     }
    // }

}

AngularComponent.new("competitionMatches")
    .setControllerClass(CompetitionMatchesController)
    .setTemplateUrl("client/components/competition-matches/competition.matches.ng.html")
    .create();
