import { IOC, Autowired, NavigationEntry, NavigationService } from "@smallstack/core";
import { Angular2Component } from "@smallstack/meteor";
import { CompetitionsService } from "@smallstack/datalayer";

import template from "./LoginComponent.html";
import { Component } from "@angular/core";

export class LoginComponent {

}

Angular2Component.new("LoginComponent", LoginComponent)
    .setTemplate(template)
    .register();

IOC.onRegister("navigationService", (navigationService: NavigationService) => {
    navigationService.addNavigationEntry(NavigationEntry.new()
        .setRoute("/login")
        .setIndex(1000)
        .setComponent(LoginComponent)
        .setI18nLabel("cuppy.navigation.login")
        .setIcon("fa fa-user")
        .setRequiresAuthentication(false)
        .setVisible(true)
        .setType("main")
    );
});
