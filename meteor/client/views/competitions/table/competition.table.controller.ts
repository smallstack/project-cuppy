/// <reference path="../../../../typedefinitions/generated.d.ts" />

smallstack.ioc.get<NavigationService>("navigationService").addNavigationEntry(NavigationEntry.new()
	.setControllerName("CompetitionTableController")
	.setRoute("/competition/:competitionName/table")
	.setRequiresAuthentication(false)
	.setTemplateUrl("client/views/competitions/table/competition.table.ng.html")
	.setVisible(false)
    .setStateName("website.competition_table")
);

class CompetitionTableController {

	@Autowired
	private notificationService: NotificationService;

	@Autowired
	private competitionsService: CompetitionsService;

	@Autowired
	private userService: UserService;

	static $inject = ["$scope", "$stateParams", "$timeout"];

	private bets: Bet[];

	constructor(private $scope: any, private $stateParams: angular.ui.IStateParamsService, $timeout: angular.ITimeoutService) {
		$scope.vm = this;

		if ($stateParams["competitionName"] === undefined) {
			NotificationService.instance().popup.error("No competition name given!");
			return;
		}

		this.loadCompetition($stateParams["competitionName"], (competition: Competition) => {
			$timeout(() => {
				this.$scope.competition = competition;
				this.$scope.loaded = true;
			});
		});
	}


	public loadCompetition(name: string, callback: (competition: Competition) => void) {
		var that = this;

		// get the competition
		var competitionQuery: QueryObject<Competition> = that.competitionsService.getCompetitionByName({ name: name });
		competitionQuery.subscribe(() => {
			var competition: Competition = competitionQuery.val(0);
			if (competition === undefined) {
				NotificationService.instance().popup.error("Competition not found : '" + name + "'!");
				return;
			}
			else {
				that.$scope.isAdministrator = competition.ownerId === Meteor.userId();
				var userIds: string[] = [];
				_.each(competition.ranking, (rank: CompetitionRank) => {
					if (!_.contains(userIds, rank.userId))
						userIds.push(rank.userId);
				});
				var userQuery: QueryObject<User> = that.userService.getUsersByIds({ ids: userIds });
				userQuery.subscribe(() => {
					that.$scope.users = {};
					_.each(userQuery.vals(), (user: User) => {
						that.$scope.users[user.id] = user;
					});
					callback(competition);
				});
			}
		});
	}
}

smallstack.angular.app.controller("CompetitionTableController", CompetitionTableController);
