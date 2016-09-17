/// <reference path="../../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
    .setControllerName("CompetitionAdministrationController")
    .setRoute("/competition/:competitionName/admin")
    .setRequiresAuthentication(true)
    .setTemplateUrl("client/views/competitions/admin/competition.admin.ng.html")
    .setVisible(false)
    .setStateName("website.competitionAdmin")
    .setSubstateOfNamed("website.competitions")
);

interface CompetitionAdministrationScope extends angular.meteor.IScope {
    competition: Competition;
    competitionSyncer: string;
    competitionTeams: { [id: string]: CompetitionTeam };
    allCompetitionTeams: CompetitionTeam[];
    sideBets: SideBet[];
    sideBetTypes: string[];
    vm: CompetitionAdministrationController;
    range: Function;
    isLoaded: boolean;
    $meteorSubscribe: any;
    $meteorCollection: any;
    $meteorAutorun: any;
    rounds: CompetitionRound[];
    allCompetitionMatches: CompetitionMatch[];
    matchesByRound: { [groupId: string]: CompetitionMatch[] };
}

class CompetitionAdministrationController {

    static $inject = ["$scope", "$stateParams", "$timeout", "competitionsService"];

    constructor(private $scope: CompetitionAdministrationScope, private $stateParams: angular.ui.IStateParamsService, private $timeout: angular.ITimeoutService, private competitionsService: CompetitionsService) {
        $scope.vm = this;
        $scope.isLoaded = false;
        $scope.sideBetTypes = _.values(SideBet.enums.resultType);
        var that = this;

        if ($stateParams["competitionName"] === undefined) {
            NotificationService.instance().popup.error("No competition name given!");
            console.log("state params : ", $stateParams);
            return;
        }

        var name = $stateParams["competitionName"];

        // load competition
        var competitionQuery: QueryObject<Competition> = CompetitionsService.instance().getCompetitionByName({ name: name });
        competitionQuery.subscribe(() => {
            competitionQuery.expand(["roundIds", "administratorIds"], () => {
                $timeout(() => {
                    that.$scope.competition = <Competition>competitionQuery.val(0);
                    that.$scope.rounds = that.$scope.competition.getRounds().val();
                    that.$scope.competitionSyncer = that.$scope.competition.syncer;
                    if (that.$scope.competition === undefined)
                        NotificationService.instance().popup.error("Competition '" + name + "' could not be loaded!");
                    else {
                        that.loadSideBets(that.$scope.competition.id);
                        that.loadAllMatches(that.$scope.competition.id);
                    }
                });
            });
        });

        this.loadAllCompetitionTeams();

        $scope.$watch("competitionSyncer", (newVal: string) => {
            if (this.$scope.competition) {
                if (newVal === undefined || newVal === "")
                    this.$scope.competition.syncer = undefined;
                else
                    this.$scope.competition.syncer = newVal;
            }
        });
    }

    public loadAllCompetitionTeams() {
        var that = this;
        var competitionTeamQuery: QueryObject<CompetitionTeam> = CompetitionTeamsService.instance().getAllCompetitionTeams({});
        competitionTeamQuery.subscribe(() => {
            that.$scope.allCompetitionTeams = competitionTeamQuery.val();
        });
    }

    public loadAllMatches(competitionId: string) {
        var that = this;
        var competitionMatchesQuery: QueryObject<CompetitionMatch> = CompetitionMatchesService.instance().getMatchesForCompetitionId({ competitionId: competitionId });
        competitionMatchesQuery.subscribe(() => {
            this.$timeout(() => {
                that.$scope.allCompetitionMatches = competitionMatchesQuery.val();
                that.$scope.matchesByRound = {};
                _.each(that.$scope.allCompetitionMatches, (match: CompetitionMatch) => {
                    if (that.$scope.matchesByRound[match.roundId] === undefined)
                        that.$scope.matchesByRound[match.roundId] = [];
                    that.$scope.matchesByRound[match.roundId].push(match);
                });
            });
        });
    }

    public loadSideBets(competitionId: string) {
        // load sidebets
        var that = this;
        var sideBetsQuery: QueryObject<SideBet> = SidebetsService.instance().getSideBetsByCompetitionId({ competitionId: competitionId });
        sideBetsQuery.subscribe(() => {
            this.$timeout(() => {
                that.$scope.sideBets = sideBetsQuery.val();
            });
        });
    }

    public addSideBet() {
        var sideBet: SideBet = new SideBet();
        sideBet.competitionId = this.$scope.competition.id;
        this.$scope.sideBets.push(sideBet);
    }

    public saveSideBets() {
        SidebetsService.instance().updateSideBets(this.$scope.sideBets, NotificationService.instance().getStandardCallback());
    }
}
smallstack.angular.app.controller("CompetitionAdministrationController", CompetitionAdministrationController);