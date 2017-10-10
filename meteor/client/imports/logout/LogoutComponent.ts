import { IOC, NavigationEntry, NavigationService } from "@smallstack/core-common";
import { Angular2Component } from "@smallstack/meteor-client";
import template from "./LogoutComponent.html";

export class LogoutComponent {

    constructor() {
        Meteor.logout();
    }

}

Angular2Component.new("LogoutComponent", LogoutComponent)
    .setTemplate(template)
    .register();

IOC.onRegister("navigationService", (navigationService: NavigationService) => {
    navigationService.addNavigationEntry(NavigationEntry.new()
        .setRoute("/logout")
        .setIndex(1000)
        .setComponent(LogoutComponent)
        .setI18nLabel("navigation.logout")
        .setIcon("fa fa-user")
        .setRequiresAuthentication(false)
        .setVisibility(NavigationEntry.enums.visibility.ONLYAUTHENTICATED)
        .setType("main")
    );
});
