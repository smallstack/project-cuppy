import { IOC, Autowired, NavigationEntry, NavigationService } from "@smallstack/core-common";
import { Angular2Component } from "@smallstack/meteor-client";
import { CompetitionsService } from "@smallstack/datalayer";

import template from "./LoginComponent.html";
import { Component } from "@angular/core";

export class LoginComponent { }

Angular2Component.new("LoginComponent", LoginComponent)
    .setTemplate(template)
    .register();

IOC.onRegister("navigationService", (navigationService: NavigationService) => {
    navigationService.addNavigationEntry(NavigationEntry.new()
        .setRoute("/login")
        .setIndex(1000)
        .setComponent(LoginComponent)
        .setI18nLabel("navigation.login")
        .setIcon("fa fa-user")
        .setRequiresAuthentication(false)
        .setVisibility(NavigationEntry.enums.visibility.ONLYANONYMOUS)
        .setType("main")
    );
});
