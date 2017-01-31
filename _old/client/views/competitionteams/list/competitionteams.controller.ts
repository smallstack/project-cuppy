/// <reference path="../../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("CompetitionTeamsController")
	.setRoute("/competitionteams")
	.setIndex(11)
	.setLabel("navigation.competitionTeams")
	.setRequiresAuthentication(true)
	.setTemplateUrl("client/views/competitionteams/list/competitionteams.view.ng.html")
	.setVisible(true)
	.setStateName("website.competitionTeams")
);

interface CompetitionTeamsScope extends ng.IScope {

}


class CompetitionTeamsController {

	static $inject = ["$scope", "competitionTeamsService", "notificationService"];
	constructor(private $scope: CompetitionTeamsScope, private competitionTeamsService: CompetitionTeamsService, private notificationService: NotificationService) {

	}
}

smallstack.angular.app.controller("CompetitionTeamsController", CompetitionTeamsController);
