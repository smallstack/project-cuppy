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
	.setSubstateOfNamed("website.competitions")
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
		this.$scope.newCompetition.type = type;
		this.competitionsService.createCompetition(this.$scope.newCompetition.name, this.$scope.newCompetition.type, (error: Meteor.Error, result: Competition) => {
			if (error)
				this.notificationService.getStandardErrorPopup(error, "Could not create new Competition!");
			else {
				this.$location.path("/competition/" + result.name + "/admin");
				this.$scope.$apply();
			}
		});
	}

	public randomizeName(type: string) {
		let name: string = "";

		// weekday
		if (_.random(0, 100) > 60)
			name += new Array("Sunday ", "Monday ", "Tuesday ", "Wednesday ", "Thursday ",
				"Friday ", "Saturday ")[new Date().getDay()];

		// time of day
		if (_.random(0, 100) > 40) {
			let currentHour: number = new Date().getHours();
			if (currentHour < 6)
				name += "Night ";
			else if (currentHour < 12)
				name += "Morning ";
			else if (currentHour < 18)
				name += "Afternoon ";
			else if (currentHour < 21)
				name += "Evening ";
			else
				name += "Night ";
		}

		// competition time
		switch (type) {
			case "pingpong":
				name += _.sample<string>(["Ping Pong ", "Pong Pong ", "Peng Pong ", "Wong Pong ", "Table Tennis "]);
				break;
			default:
		}

		// random cup name thin
		name += _.sample<string>(["Cup", "Super Cup", "Tournament", "Derby", "Local Derby", "Breakdown", "Degradation", "World Cup", "Bowl", "Super Bowl", "Contest", "Fight", "Blast"]);

		this.$scope.newCompetition.name = name;
	}

}
smallstack.angular.app.controller("CreateCompetitionController", CreateCompetitionController);