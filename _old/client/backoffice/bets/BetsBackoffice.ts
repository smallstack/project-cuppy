/// <reference path="../../../typedefinitions/generated.d.ts" />


smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRoute("/manage/cuppy/bets")
    .setRequiresAuthentication(true)
    .setRequiredRole("backoffice.cuppy")
    .setTemplateUrl("client/backoffice/bets/BetsBackoffice.ng.html")
    .setVisible(true)
    .setType("backoffice")
    .setIcon("fa-futbol-o")
    .setLabel("Bets")
    .setStateName("backoffice.cuppy.bets")
    .setControllerName("CuppyBetsBackofficeController")
    .setSubstateOfNamed("backoffice.cuppy")
);


class CuppyBetsBackofficeController {

    static $inject = ["$scope", "utils", "$timeout"];
    constructor(private $scope: any, private utils: Utils, private $timeout: angular.ITimeoutService) {
        this.$scope.vm = this;
    }

    public getUser(userString) {
        return Meteor.callPromise("collection-search", { collectionName: "users", queryString: userString });
    }

    public getCompetition(competitionString) {
        return Meteor.callPromise("collection-search", { collectionName: "competitions", queryString: competitionString });
    }

    public searchMatchesAndBets() {
        // get matches
        var matchesQuery: QueryObject<CompetitionMatch> = CompetitionMatchesService.instance().getMatchesForCompetitionId({ competitionId: this.$scope.selectedCompetition.id });
        matchesQuery.subscribe(() => {
            matchesQuery.expand([CompetitionMatchesCollection.expandables.teamIds], () => {
                this.$scope.matches = matchesQuery.vals();
                // get bets
                var betQuery: QueryObject<Bet> = BetsService.instance().getBetsForCompetitionAndUserId({ competitionId: this.$scope.selectedCompetition.id, userId: this.$scope.selectedUser._id });
                betQuery.subscribe(() => {
                    this.$timeout(() => {
                        this.$scope.bets = {};
                        var bets: Bet[] = betQuery.vals();
                        _.each(this.$scope.matches, (competitionMatch: CompetitionMatch) => {
                            var bet: Bet = _.find(bets, (bet: Bet) => bet.matchId === competitionMatch.id);
                            if (!bet) {
                                bet = new Bet();
                                bet.result = [0, 0];
                            }
                            this.$scope.bets[competitionMatch.id] = bet;
                        });
                    });
                });
            });
        });
    }

    public saveUserBet(matchId, userId, homeGoals, awayGoals) {
        Meteor.call("backoffice-manual-bet-update", matchId, userId, homeGoals, awayGoals, NotificationService.instance().getStandardCallback());
    }
}

smallstack.angular.app.controller("CuppyBetsBackofficeController", CuppyBetsBackofficeController);
