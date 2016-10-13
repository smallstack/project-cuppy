/// <reference path="../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRoute("/competition/:competitionName/sidebets")
    .setRequiresAuthentication(false)
    .setTemplate("<competition-sidebets></competition-sidebets>")
    .setVisible(false)
    .setStateName("website.competition_sidebets")
);


class CompetitionSidebetsController extends AngularBaseComponentController implements InitializationAware {

    @Autowired
    private sidebetsService: SidebetsService;

    @Autowired
    private competitionsService: CompetitionsService;

    static $inject = ["$scope", "$stateParams", "$timeout", "$state"];

    public afterInitialization() {
        this.$scope.loaded = false;
        this.$scope.mySideBets = {};

        if (this.$stateParams["competitionName"] === undefined) {
            NotificationService.instance().popup.error("No competition name given!");
            return;
        }

        // load all teams
        var competitionTeamQuery: QueryObject<CompetitionTeam> = CompetitionTeamsService.instance().getAllCompetitionTeams({});
        competitionTeamQuery.subscribe(() => {
            this.$timeout(() => {
                this.$scope.allCompetitionTeams = competitionTeamQuery.val();
            });
        });

        this.loadCompetition(this.$stateParams["competitionName"], (competitionId: string) => {
            // get sidebets
            var sidebetsQuery: QueryObject<SideBet> = this.sidebetsService.getSideBetsByCompetitionId({ competitionId: competitionId });
            sidebetsQuery.subscribe(() => {
                this.$scope.sidebets = sidebetsQuery.val();
                var mySideBets: QueryObject<SideBetUserBet> = SidebetuserbetsService.instance().getForUserId({ userId: Meteor.userId() });
                mySideBets.subscribe(() => {
                    this.$timeout(() => {
                        var mySideBetsArray: SideBetUserBet[] = mySideBets.val();
                        _.each(this.$scope.sidebets, (sideBet: SideBet) => {
                            var mySideBet: SideBetUserBet = _.find(mySideBetsArray, (userSideBet: SideBetUserBet) => userSideBet.sideBetId === sideBet.id);
                            if (mySideBet)
                                this.$scope.mySideBets[sideBet.id] = mySideBet;
                            else {
                                this.$scope.mySideBets[sideBet.id] = SideBetUserBet.fromDocument({
                                    sideBetId: sideBet.id,
                                    ownerId: Meteor.userId()
                                });
                            }
                        });
                    });
                });
            });
        });
    }

    public loadCompetition(name: string, callback: (competitionId: string) => void) {
        var that = this;

        // get the competition
        var competitionQuery: QueryObject<Competition> = that.competitionsService.getCompetitionByName({ name: name });
        competitionQuery.subscribe(() => {
            that.$scope.competition = competitionQuery.val(0);
            that.$scope.loaded = true;
            if (that.$scope.competition === undefined) {
                NotificationService.instance().popup.error("Competition not found : '" + name + "'!");
                return;
            }
            else {
                that.$scope.isAdministrator = that.$scope.competition.ownerId === Meteor.userId();
                callback(that.$scope.competition.id);
            }
        });
    }

    public saveAllSideBets() {
        SidebetuserbetsService.instance().updateAllUserSideBets(_.values(this.$scope.mySideBets), NotificationService.instance().getStandardCallback("Could not save your sidebets, sorry!", "Sidebets successfully saved!"));
    }
}

AngularComponent.new("competitionSidebets")
    .setControllerClass(CompetitionSidebetsController)
    .setTemplateUrl("client/components/competition-sidebets/competition.sidebets.ng.html")
    .create();