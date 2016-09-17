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
	.setSubstateOfNamed("website.competitions")
);


interface CompetitionsScope extends ng.IScope {
	title: string;
	competitions: Competition[];
}


class CompetitionsController {

	@Autowired
	private notificationService: NotificationService;

	@Autowired
	private competitionsService: CompetitionsService;

	static $inject = ["$scope", "$timeout", "$state"];

	constructor(private $scope: CompetitionsScope, private $timeout: angular.ITimeoutService, private $state: angular.ui.IStateService) {

		switch ($state.current.name) {

			case "website.competitions":
				$scope.title = "navigation.competitions";
				this.loadAllCompetitions(this.competitionsService.getAllCompetitions({}));
				break;

			case "website.mycompetitions":
				$scope.title = "navigation.mycompetitions";
				this.loadAllCompetitions(this.competitionsService.getMyCompetitions({}));
				break;

			default:
				this.notificationService.popup.error("No valid state name given : " + $state.current.name);
		}

	}

	private loadAllCompetitions(queryObject: QueryObject<Competition>) {
		queryObject.subscribe(() => {
			queryObject.expand(["ownerId"], () => {
				this.$timeout(() => {
					this.$scope.competitions = queryObject.val();
				});
			});
		});
	}
}

smallstack.angular.app.controller("CompetitionsController", CompetitionsController);
