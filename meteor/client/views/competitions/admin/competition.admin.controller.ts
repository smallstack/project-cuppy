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
    competitionTeams: CompetitionTeam[];
    administrators: User[];
    allCompetitionTeams: CompetitionTeam[];
    sideBets: SideBet[];
    sideBetTypes: string[];
    vm: CompetitionAdministrationController;
    range: Function;
    isLoaded: boolean;
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

        if ($stateParams["competitionName"] === undefined) {
            NotificationService.instance().popup.error("No competition name given!");
            console.log("state params : ", $stateParams);
            return;
        }

        var name = $stateParams["competitionName"];

        // load competition
        var competitionQuery: QueryObject<Competition> = CompetitionsService.instance().getCompetitionByName({ name: name }, { reactive: false });
        competitionQuery.subscribe(() => {
            competitionQuery.expand(["roundIds", "teamIds.linkedUserIds"], () => {
                Tracker.autorun(() => {
                    let competition: Competition = competitionQuery.val(0);
                    if (competition === undefined)
                        NotificationService.instance().popup.error("Competition '" + name + "' could not be loaded!");
                    else {
                        $timeout(() => {
                            this.$scope.competition = competition;
                            this.$scope.rounds = competition.getRounds().val();
                            this.$scope.competitionSyncer = competition.syncer;
                            this.$scope.competitionTeams = competition.getTeams().val();
                        });
                        this.loadSideBets(competition.id);
                        this.loadAllMatches(competition.id);
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
        var competitionTeamQuery: QueryObject<CompetitionTeam> = CompetitionTeamsService.instance().getAllCompetitionTeams({});
        competitionTeamQuery.subscribe(() => {
            this.$scope.allCompetitionTeams = competitionTeamQuery.val();
        });
    }

    public loadAllMatches(competitionId: string) {
        var competitionMatchesQuery: QueryObject<CompetitionMatch> = CompetitionMatchesService.instance().getMatchesForCompetitionId({ competitionId: competitionId });
        competitionMatchesQuery.subscribe(() => {
            this.$timeout(() => {
                this.$scope.allCompetitionMatches = competitionMatchesQuery.val();
                this.$scope.matchesByRound = {};
                _.each(this.$scope.allCompetitionMatches, (match: CompetitionMatch) => {
                    if (this.$scope.matchesByRound[match.roundId] === undefined)
                        this.$scope.matchesByRound[match.roundId] = [];
                    this.$scope.matchesByRound[match.roundId].push(match);
                });
            });
        });
    }

    public loadSideBets(competitionId: string) {
        // load sidebets
        var sideBetsQuery: QueryObject<SideBet> = SidebetsService.instance().getSideBetsByCompetitionId({ competitionId: competitionId });
        sideBetsQuery.subscribe(() => {
            this.$timeout(() => {
                this.$scope.sideBets = sideBetsQuery.val();
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
