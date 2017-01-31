/// <reference path="../../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("CreateCompetitionTeamController")
	.setRoute("/competitionteams/new")
	.setIndex(10)
	.setLabel("navigation.newcompetitionTeam")
	.setRequiresAuthentication(true)
	.setTemplateUrl("client/views/competitionteams/create/competitionteam.view.ng.html")
	.setVisible(true)
    .setStateName("website.newcompetitionteam")
);

interface CreateCompetitionTeamScope extends ng.IScope {
	newCompetitionTeam: CompetitionTeam;
	vm: CreateCompetitionTeamController;
}

class CreateCompetitionTeamController {

	static $inject = ["$scope", "competitionTeamsService", "$location", "notificationService"];

	constructor(private $scope: CreateCompetitionTeamScope, private competitionTeamsService: CompetitionTeamsService, private $location: ng.ILocationService, private notificationService: NotificationService) {
		$scope.vm = this;
		$scope.newCompetitionTeam = new CompetitionTeam();
		$scope.newCompetitionTeam.ownerId = Meteor.userId();
	}

	public createCompetitionTeam() {
		var self = this;
		self.competitionTeamsService.saveCompetitionTeam(this.$scope.newCompetitionTeam, function (error: Meteor.Error, savedId: string) {
			if (error) self.notificationService.getStandardErrorPopup(error, "Could not create new competitionTeam!");
			else {
				self.$location.path("/competitionteam/" + savedId);
				self.$scope.$apply();
			}
		});
	}
}
smallstack.angular.app.controller("CreateCompetitionTeamController", CreateCompetitionTeamController);