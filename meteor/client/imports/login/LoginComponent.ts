import { AngularComponent } from "@smallstack/core-client";
import { IOC, NavigationEntry, NavigationService } from "@smallstack/core-common";
import template from "./LoginComponent.html";

export class LoginComponent { }

AngularComponent.new("LoginComponent", LoginComponent)
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
