/// <reference path="../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setRoute("/competition/:competitionName/sidebets")
    .setRequiresAuthentication(false)
    .setTemplate("<competition-sidebets></competition-sidebets>")
    .setVisible(false)
    .setStateName("website.competition_sidebets")
);


class CompetitionSidebetsController extends AngularBaseComponentController {

    @Autowired
    private sidebetsService: SidebetsService;

    @Autowired
    private competitionsService: CompetitionsService;

    static $inject = ["$scope", "$stateParams", "$timeout", "$state"];

    constructor(protected $scope: any, private $stateParams: angular.ui.IStateParamsService, $timeout: angular.ITimeoutService, private $state: angular.ui.IStateService) {
        super($scope);
        $scope.vm = this;
        $scope.loaded = false;
        $scope.mySideBets = {};

        if ($stateParams["competitionName"] === undefined) {
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

        this.loadCompetition($stateParams["competitionName"], (competitionId: string) => {
            // get sidebets
            var sidebetsQuery: QueryObject<SideBet> = this.sidebetsService.getSideBetsByCompetitionId({ competitionId: competitionId });
            sidebetsQuery.subscribe(() => {
                $scope.sidebets = sidebetsQuery.val();
                var mySideBets: QueryObject<SideBetUserBet> = SidebetuserbetsService.instance().getForUserId({ userId: Meteor.userId() });
                mySideBets.subscribe(() => {
                    this.$timeout(() => {
                        var mySideBetsArray: SideBetUserBet[] = mySideBets.val();
                        _.each($scope.sidebets, (sideBet: SideBet) => {
                            var mySideBet: SideBetUserBet = _.find(mySideBetsArray, (userSideBet: SideBetUserBet) => userSideBet.sideBetId === sideBet.id);
                            if (mySideBet)
                                $scope.mySideBets[sideBet.id] = mySideBet;
                            else {
                                $scope.mySideBets[sideBet.id] = SideBetUserBet.fromDocument({
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