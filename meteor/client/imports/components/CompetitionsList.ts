import {
	IOC, Autowired, NavigationEntry, NavigationService, Angular2Component, NotificationService,
	QueryObject
} from "smallstack";

import { Competition, CompetitionsService } from "smallstack-datalayer";

class CompetitionsList {

	@Autowired()
	private notificationService: NotificationService;

	@Autowired()
	private competitionsService: CompetitionsService;


	constructor() {

		// switch ($state.current.name) {

		// 	case "website.competitions":
		// 		$scope.title = "navigation.competitions";
		// 		this.loadAllCompetitions(this.competitionsService.getAllCompetitions({}));
		// 		break;

		// 	case "website.mycompetitions":
		// 		$scope.title = "navigation.mycompetitions";
		// 		this.loadAllCompetitions(this.competitionsService.getMyCompetitions({}));
		// 		break;

		// 	default:
		// 		this.notificationService.popup.error("No valid state name given : " + $state.current.name);
		// }

	}

	private loadAllCompetitions(queryObject: QueryObject<Competition>) {
		// queryObject.subscribe(() => {
		// 	queryObject.expand(["ownerId"], () => {
		// 		this.$timeout(() => {
		// 			this.$scope.competitions = queryObject.vals();
		// 		});
		// 	});
		// });
	}
}


IOC.onRegister("navigationService", (navigationService: NavigationService) => {
	navigationService.addNavigationEntry(NavigationEntry.new()
		.setRoute("/competitions")
		.setIndex(101)
		.setIcon("fa fa-trophy")
		.setLabel("navigation.competitions")
		.setRequiresAuthentication(false)
		.setVisible(true)
		.setType("main")
		.setDefaultRoute(false)
	);

	navigationService.addNavigationEntry(NavigationEntry.new()
		.setRoute("/competitions/mine")
		.setIndex(4)
		.setLabel("navigation.mycompetitions")
		.setRequiresAuthentication(true)
		.setVisible(true)
	);
});
