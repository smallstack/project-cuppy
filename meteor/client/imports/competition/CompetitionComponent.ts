import { IOC, Logger, Autowired, NavigationEntry, NavigationService, LocalizationService, QueryObject } from "@smallstack/core-common";
import { InitializationAware } from "@smallstack/core-client";
import { Angular2BaseComponentController, Angular2Component } from "@smallstack/meteor-client";
import { CompetitionMatchesService, BetsService, CompetitionsService, CompetitionRoundsService, Competition, CompetitionRound, CompetitionMatch, Bet } from "@smallstack/datalayer";

import * as _ from "underscore";
import * as $ from "jquery";

import template from "./CompetitionComponent.html";

export class CompetitionComponent extends Angular2BaseComponentController implements InitializationAware {

    @Autowired()
    private competitionMatchesService: CompetitionMatchesService;

    @Autowired()
    private localizationService: LocalizationService;

    @Autowired()
    private betsService: BetsService;

    @Autowired()
    private competitionsService: CompetitionsService;

    @Autowired()
    private competitionRoundsService: CompetitionRoundsService;

    public competition: Competition;
    public loaded: boolean;
    public selectedRound: CompetitionRound;
    public isAdministrator: boolean;
    public bets: Bet[];
    public matches: CompetitionMatch[];
    public currentMatch: CompetitionMatch;
    public currentBetHome: number;
    public currentBetAway: number;
    public roundName: string;
    public rounds: CompetitionRound[];

    public afterInitialization() {
        this.loaded = false;
        console.log("afterInit called");

        this.getRouteParameter("competitionName", (competitionName: string) => {
            if (competitionName === undefined) {
                this.notificationService.popup.error("No competition name present in URL!");
                return;
            }
            this.getRouteParameter("competitionRoundId", (competitionRoundId: string) => {

                this.loadCompetition(competitionName, (competitionId: string) => {
                    this.loadCompetitionRounds(competitionId, competitionRoundId);
                });

            });
        });
    }

    public loadCompetitionRounds(competitionId: string, competitionRoundId: string) {
        // get rounds
        var roundsQuery: QueryObject<CompetitionRound> = this.competitionRoundsService.getAllRoundsForCompetitionId({ competitionId: competitionId });
        roundsQuery.subscribe(() => {
            this.rounds = roundsQuery.getModels();

            // if competitionRound === current
            if (competitionRoundId === "current") {
                var currentRound: CompetitionRound = _.find(this.rounds, (round: CompetitionRound) => !round.allMatchesFinished);
                if (currentRound !== undefined)
                    competitionRoundId = currentRound.id;
                else
                    competitionRoundId = undefined;
            }

            if (competitionRoundId === undefined)
                this.roundName = "competition.allmatches";
            else {
                this.selectedRound = _.find(this.rounds, (round: CompetitionRound) => round.id === competitionRoundId);
                if (this.selectedRound)
                    this.roundName = this.selectedRound.name;
            }

            this.loadMatches(competitionId, competitionRoundId, (competitionId: string) => {
                this.loadMyBets(competitionId, () => {
                    this.ngZone.run(() => {
                        this.loaded = true;
                    });
                });
            });
        });
    }


    public loadCompetition(name: string, callback: (competitionId: string) => void) {
        // get the competition
        var competitionQuery: QueryObject<Competition> = this.competitionsService.getCompetitionByName({ name: name });
        competitionQuery.subscribe(() => {
            this.ngZone.run(() => {
                this.competition = competitionQuery.getModel(0);
                this.loaded = true;
            });
            if (this.competition === undefined) {
                this.notificationService.popup.error("Competition not found : '" + name + "'!");
                return;
            }
            else {
                this.isAdministrator = this.competition.administratorIds.indexOf(Meteor.userId()) !== -1;
                callback(this.competition.id);
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
            this.ngZone.run(() => {
                this.matches = query.getModels();
            });
            // query.expand(["teamIds.linkedUserIds"], () => {
            //     callback(competitionId);
            // });
        });
    }

    private loadMyBets(competitionId: string, callback: () => void) {
        this.bets = [];
        if (Meteor.userId()) {
            var query: QueryObject<Bet> = this.betsService.getBetsForCompetitionAndUserId({ 'competitionId': competitionId, 'userId': Meteor.userId() });
            query.subscribe(() => {
                _.each<Bet>(query.getModels(), (bet: Bet) => {
                    this.bets[bet.matchId] = bet;
                });
                callback();
            });
        }
        else
            callback();
    }

    public update(match: CompetitionMatch) {
        if (match.result[0] && match.result[1]) {
            match.updateScores((error: Error, result: boolean) => {
                if (error) this.notificationService.getStandardErrorPopup(error, "Could not save match scores!");
                else {
                    if (result) {
                        this.notificationService.notification.success("Scores saved!");
                    }
                    else {
                        console.warn("Updating scores returned false!");
                    }
                }
            });
        }
    }

    public placeBet() {
        if (this.currentMatch) {
            this.currentMatch.placeBet(this.currentBetHome, this.currentBetAway, (error: Error, betId: string) => {
                if (error)
                    this.notificationService.getStandardErrorPopup(error, "Could not update Bet!");
                else {
                    var betQuery: QueryObject<Bet> = this.betsService.getBetById({ id: betId });
                    betQuery.subscribe(() => {
                        this.ngZone.run(() => {
                            this.bets[this.currentMatch.id] = betQuery.getModel(0);
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
        var currentMatch = this.currentMatch;
        if (currentMatch) {
            if (!(currentMatch.result instanceof Array) || typeof currentMatch.result[0] !== "number" || typeof currentMatch.result[1] !== "number")
                this.notificationService.popup.error("Could not save results since not both sides are given!");
            else {
                currentMatch.updateScores((error: Error, result: boolean) => {
                    if (error)
                        this.notificationService.getStandardErrorPopup(error, "Could not save results!");
                    else {
                        this.ngZone.run(() => {
                            (<any>$("#matchEditModal")).modal('hide');
                            this.currentMatch = undefined;
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
        var currentMatch = this.currentMatch;

        if (currentMatch) {
            currentMatch.resetScores((error: Error, result: boolean) => {

                if (error)
                    this.notificationService.getStandardErrorPopup(error, "Could not reset results!");
                else {
                    this.ngZone.run(() => {
                        (<any>$("#matchEditModal")).modal('hide');

                        // reset that one match
                        _.each(this.matches, (match: CompetitionMatch) => {
                            if (match.id === currentMatch.id)
                                match.result = [];
                        });
                        this.currentMatch = undefined;
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
            this.currentBetHome += delta;
        if (resultIndex === 1)
            this.currentBetAway += delta;
    }

    public updateCurrentMatch(resultIndex, delta) {
        if (!this.currentMatch.result)
            this.currentMatch.result = [];
        if (this.currentMatch.result[resultIndex] === undefined) {
            this.currentMatch.result[0] = 0;
            this.currentMatch.result[1] = 0;
        }
        else {
            this.currentMatch.result[resultIndex] += delta;
            if (this.currentMatch.result[resultIndex] < 0)
                this.currentMatch.result[resultIndex] = 0;
        }
    }

    public openMatchDetailPage(match: CompetitionMatch) {
        this.router.navigate(["competition", this.competition.name, "matches", match.id]);
    }

    public openModal(match: CompetitionMatch) {
        this.openMatchDetailPage(match);
        // if (Meteor.userId()) {
        //     this.currentMatch = match;
        //     if (this.isAdministrator)
        //         (<any>$("#adminModal")).modal();
        //     else {
        //         if (this.currentMatch.isBetable())
        //             this.openBetModal();
        //         else
        //             this.$state.go("website.matchDetail", { matchId: match.id, competitionName: competitionName });
        //     }
        // } else {
        //     this.notificationService.popup.error("You must be logged in before you can place a bet or watch the statistics!");
        // }
    }

    public openBetModal() {
        if (this.isAdministrator)
            (<any>$("#adminModal")).modal('hide');

        if (this.bets[this.currentMatch.id] === undefined) {
            this.currentBetHome = 0;
            this.currentBetAway = 0;
        } else {
            this.currentBetHome = this.bets[this.currentMatch.id].result[0];
            this.currentBetAway = this.bets[this.currentMatch.id].result[1];
        }

        (<any>$("#betModal")).modal();
    }

    public goToDetails(match: CompetitionMatch) {
        if (this.isAdministrator)
            (<any>$("#adminModal")).modal('hide');
        this.router.navigate(["competition", this.competition.name, "matches", match.id]);
    }

    public openMatchEditModal() {
        if (this.isAdministrator)
            (<any>$("#adminModal")).modal('hide');
        (<any>$("#matchEditModal")).modal();
    }
}

Angular2Component.new("CompetitionComponent", CompetitionComponent)
    .setTemplate(template)
    .register();

IOC.onRegister("navigationService", (navigationService: NavigationService) => {

    navigationService.addNavigationEntry(NavigationEntry.new()
        .setRoute("/competition/:competitionName")
        .setLabel("navigation.competition")
        .setRequiresAuthentication(false)
        .setComponent(CompetitionComponent)
        .setVisible(false)
    );

    navigationService.addNavigationEntry(NavigationEntry.new()
        .setRoute("/competition/:competitionName/rounds/:competitionRoundId")
        .setLabel("navigation.competitionRound")
        .setRequiresAuthentication(false)
        .setComponent(CompetitionComponent)
        .setVisible(false)
    );
})
