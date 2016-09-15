/// <reference path="../../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("CompetitionsController")
	.setRoute("/competitions")
	.setIndex(101)
	.setIcon("fa fa-trophy")
	.setLabel("navigation.competitions")
	.setRequiresAuthentication(false)
	.setTemplateUrl("client/views/competitions/list/competitions.ng.html")
	.setVisible(true)
	.setStateName("website.competitions")
	.setType("main")
	.setDefaultRoute(false)
);

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("CompetitionsController")
	.setRoute("/competitions/mine")
	.setIndex(4)
	.setLabel("navigation.mycompetitions")
	.setRequiresAuthentication(true)
	.setTemplateUrl("client/views/competitions/list/competitions.ng.html")
	.setVisible(true)
	.setStateName("website.mycompetitions")
);


interface CompetitionsScope extends ng.IScope {
	createCompetition: Function;
	title: string;
	methodName: string;
	subscriptionName: string;
}


class CompetitionsController {

	@Autowired
	private notificationService: NotificationService;

	static $inject = ["$scope", "$location", "$state"];

	constructor(private $scope: CompetitionsScope, private $location: angular.ILocationService, private $state: angular.ui.IStateService) {
		$scope.createCompetition = function () {
			$location.path("competitions/new");
		}

		switch ($state.current.name) {
			case "website.competitions":
				$scope.title = "navigation.competitions";
				$scope.methodName = "getAllCompetitions";
				$scope.subscriptionName = "allCompetitions";
				break;
			case "website.mycompetitions":
				$scope.title = "navigation.mycompetitions";
				$scope.methodName = "getMyCompetitions";
				$scope.subscriptionName = "myCompetitions";
				break;
			default:
				this.notificationService.popup.error("No valid state name given : " + $state.current.name);
		}

		// competitionsService.getMyCompetitionsCount(function(error: Meteor.Error, count: number) {
		// 	if (error) console.error(error);
		// 	else console.log("my competitions count : ", count);
		// });


	}
}

smallstack.angular.app.controller("CompetitionsController", CompetitionsController);
