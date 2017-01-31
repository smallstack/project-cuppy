/// <reference path="../../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("CreateBetGroupController")
	.setRoute("/betgroup/new")
	.setIndex(3)
	.setLabel("navigation.newbetgroup")
	.setRequiresAuthentication(true, "website.login")
	.setTemplateUrl("client/views/betgroups/create/betgroups.create.ng.html")
	.setVisible(false)
    .setStateName("website.newbetgroup")
	.setType("main")
);


class CreateBetGroupController {

	@Autowired
	private betgroupsService: BetgroupsService;

	@Autowired
	private notificationService: NotificationService;


	static $inject = ["$scope", "$location", "$timeout"];

	constructor(private $scope: any, private $location: ng.ILocationService, private $timeout: angular.ITimeoutService) {
		$scope.vm = this;
		$scope.types = _.toArray<string>(BetGroup.enums.access);
	}

	public createBetGroup(type) {
		var betGroup: BetGroup = new BetGroup();
		betGroup.ownerId = Meteor.userId();
		betGroup.access = type;
		betGroup.name = this.$scope.newBetGroupName;
		betGroup.description = this.$scope.newBetGroupDescription;
		this.betgroupsService.saveBetGroup(betGroup, (error: Meteor.Error, resultId: string) => {
			if (error) this.notificationService.getStandardErrorPopup(error, "Could not create new BetGroup!");
			else {
				this.$timeout(() => {
					this.$location.path("/betgroup/" + resultId + "/admin");
				});
			}
		});
	}

}
smallstack.angular.app.controller("CreateBetGroupController", CreateBetGroupController);