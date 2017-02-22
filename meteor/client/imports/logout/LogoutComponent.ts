import { IOC, Autowired, NavigationEntry, NavigationService } from "@smallstack/core";
import { Angular2Component } from "@smallstack/meteor";
import { CompetitionsService } from "@smallstack/datalayer";

import template from "./LogoutComponent.html";
import { Component } from "@angular/core";


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
        .setI18nLabel("navigation.login")
        .setIcon("fa fa-user")
        .setRequiresAuthentication(false)
        .setVisibility(NavigationEntry.enums.visibility.ONLYAUTHENTICATED)
        .setType("main")
    );
});
