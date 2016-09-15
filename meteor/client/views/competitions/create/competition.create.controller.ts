/// <reference path="../../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("CreateCompetitionController")
	.setRoute("/competitions/new")
	.setIndex(2)
	.setLabel("navigation.newcompetition")
	.setRequiresAuthentication(true, "website.login")
	.setTemplateUrl("client/views/competitions/create/competition.create.ng.html")
	.setVisible(false)
    .setStateName("website.newcompetition")
	.setType("main")
);

interface CreateCompetitionScope extends ng.IScope {
	newCompetition: Competition;
	vm: CreateCompetitionController;
	types: string[];
}

class CreateCompetitionController {

	static $inject = ["$scope", "competitionsService", "$location", "notificationService"];

	constructor(private $scope: CreateCompetitionScope, private competitionsService: CompetitionsService, private $location: ng.ILocationService, private notificationService: NotificationService) {
		$scope.vm = this;
		$scope.newCompetition = new Competition();
		$scope.types = _.toArray<string>(Competition.enums.type);
	}

	public createCompetition(type) {
		var that = this;
		this.$scope.newCompetition.type = type;
		that.competitionsService.createCompetition(this.$scope.newCompetition.name, this.$scope.newCompetition.type, function (error: Meteor.Error, result: Competition) {
			if (error) that.notificationService.getStandardErrorPopup(error, "Could not create new Competition!");
			else {
				that.$location.path("/competition/" + result.name + "/admin");
				that.$scope.$apply();
			}
		});
	}

}
smallstack.angular.app.controller("CreateCompetitionController", CreateCompetitionController);