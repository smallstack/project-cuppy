import { IOC, Autowired, NavigationEntry, NavigationService, Angular2Component } from "smallstack";
import template from "./home.html";
import { Component } from "@angular/core";

@Component({
	template
})
class HomeController {
	public competitions = [{ "test": "hallo" }, { "test": "dudu" }];

}

Angular2Component.new("HomeComponent", HomeController)
	.setInitializeAngularComponent(false)
	.register();

IOC.onRegister("navigationService", (navigationService: NavigationService) => {
	navigationService.addNavigationEntry(NavigationEntry.new()
		.setRoute("/")
		.setIndex(1)
		.setComponent(HomeController)
		.setLabel("Home")
		.setIcon("fa fa-home")
		.setRequiresAuthentication(false)
		.setVisible(true)
		.setType("main")
		.setDefaultRoute(true)
	);
});
