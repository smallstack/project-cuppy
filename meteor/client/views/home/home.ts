/// <reference path="../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setRoute("/home")
	.setIndex(1)
	.setLabel("Home")
	.setLabel("navigation.home")
	.setIcon("fa fa-home")
	.setRequiresAuthentication(false)
	.setTemplateUrl("client/views/home/home.ng.html")
	.setVisible(true)
    .setStateName("website.home")
	.setType("main")
	.setDefaultRoute(true)
	.setControllerName("HomeController")
);


class HomeController {

	@Autowired
	private notificationService: NotificationService;

	@Autowired
	private competitionsService: CompetitionsService;

	static $inject = ["$scope", "$timeout"];

	constructor(private $scope: any, private $timeout: angular.ITimeoutService) {

		this.competitionsService.getAllCompetitions({}, { entriesPerPage: 6 }).subscribe((cursor) => {
			this.$timeout(() => {
				this.$scope.competitions = cursor.fetch();
			});
		});

	}
}

smallstack.angular.app.controller("HomeController", HomeController);
