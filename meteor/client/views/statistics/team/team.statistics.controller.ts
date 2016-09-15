/// <reference path="../../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("TeamStatisticsController")
	.setRoute("/statistics/team/:teamId")
	.setRequiresAuthentication(false)
	.setTemplateUrl("client/views/statistics/team/team.statistic.ng.html")
	.setVisible(false)
	.setStateName("website.userStatistics")
);

interface TeamStatisticsScope extends ng.IScope {
	competitionTeam: CompetitionTeam;
	$meteorAutorun: Function;
	statistics: any;
}


class TeamStatisticsController {

	static $inject = ["$scope", "competitionTeamsService", "$location", "facebookService", "$stateParams", "notificationService"];

	constructor(private $scope: TeamStatisticsScope, private competitionTeamsService: CompetitionTeamsService, private $location: ng.ILocationService, private facebookService: FacebookService,
		private $stateParams: angular.ui.IStateParamsService, private notificationService: NotificationService) {

		if ($stateParams["teamId"] === undefined) {
			NotificationService.instance().popup.error("No team id given!");
			return;
		}
		var that = this;
		var teamQuery: QueryObject<CompetitionTeam> = that.competitionTeamsService.getCompetitionTeamById({ id: $stateParams["teamId"] });
		teamQuery.subscribe(() => {
			$scope.$meteorAutorun(function () {
				$scope.competitionTeam = teamQuery.val(0);
				that.loadStatistics($scope.competitionTeam);
				teamQuery.expand(["linkedUserIds"], function () {
					console.log("callback called! team : ", $scope.competitionTeam);
				});
			});
		});
	}

	public loadStatistics(competitionTeam: CompetitionTeam) {
		var that = this;
		that.$scope.statistics = {};

		// won/lost/drawn
		that.$scope.statistics.matchResults = { labels: ["won", "lost", "drawn"], options: { percentageInnerCutout: 80, segmentStrokeWidth: 3, segmentStrokeColor: "#F7F7F7" } };

		// goals per match
		that.$scope.statistics.totalMatches = 0;
		that.$scope.statistics.totalGoals = 0;

		// team things
		that.$scope.statistics.teamMatches = 0;
		that.$scope.statistics.teamWins = 0;
		that.$scope.statistics.teamLoss = 0;
		that.$scope.statistics.teamDrawn = 0;


		var matchQuery: QueryObject<CompetitionMatch> = CompetitionMatchesService.instance().getMatchesForTeam({ competitionTeamId: competitionTeam.id });
		matchQuery.subscribe(() => {
			matchQuery.expand(["teamIds"], function () {
				var won = 0;
				var lost = 0;
				var drawn = 0;
				matchQuery.cursor.forEach(function (match: CompetitionMatch) {

					// get corresponding team
					var teams = match.getTeams().val();

					that.$scope.statistics.totalMatches++;

					if (match.isWinner(competitionTeam.id)) {
						won++;
						that.$scope.statistics.totalGoals += match.getWinnerGoals();
					}
					if (match.isLoser(competitionTeam.id)) {
						lost++;
						that.$scope.statistics.totalGoals += match.getLoserGoals();
					}
					if (match.isDrawn()) {
						drawn++;
						that.$scope.statistics.totalGoals += match.getDrawnGoals();
					}
				});
				that.$scope.statistics.matchResults.data = [won, lost, drawn];
			});
		});
	}
}

smallstack.angular.app.controller("TeamStatisticsController", TeamStatisticsController);
