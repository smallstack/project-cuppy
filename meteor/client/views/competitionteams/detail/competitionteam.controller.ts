/// <reference path="../../../../typedefinitions/generated.d.ts" />


smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("CompetitionTeamController")
	.setRoute("/competitionteam/:competitionTeamId")
	.setRequiresAuthentication(true)
	.setTemplateUrl("client/views/competitionteams/detail/competitionteam.view.ng.html")
	.setVisible(false)
	.setStateName("website.competitionTeam")
);

interface CompetitionTeamScope extends ng.IScope {
	competitionTeam: CompetitionTeam;
	vm: CompetitionTeamController;
}


class CompetitionTeamController {

	static $inject = ["$scope", "competitionTeamsService", "notificationService", "$stateParams", "utils"];
	constructor(private $scope: CompetitionTeamScope, private competitionTeamsService: CompetitionTeamsService, private notificationService: NotificationService, private $stateParams: ng.ui.IStateParamsService, private utils: Utils) {
		$scope.vm = this;

		if (!utils.isNonEmptyString($stateParams["competitionTeamId"])) {
			notificationService.popup.error("No competitionTeamId found in URL!");
		}
		else {
			this.load($stateParams["competitionTeamId"]);
		}
	}

	public load(id: string) {
		var self = this;
		this.$scope.competitionTeam = this.competitionTeamsService.getCompetitionTeamById({ id: id }).cursor.fetch()[0];
	}
}

smallstack.angular.app.controller("CompetitionTeamController", CompetitionTeamController);