import { AngularBaseComponentController, AngularComponent } from "@smallstack/core-client";
import { IOC, NavigationEntry, NavigationService, QueryObject } from "@smallstack/core-common";
import { Competition } from "@smallstack/datalayer";
import template from "./CompetitionsComponent.html";


export class CompetitionsComponent extends AngularBaseComponentController {

    public competitions: Competition[];
    public queryObject: QueryObject<Competition>;
    public pageCount: number = 0;
    public entriesPerPage: number = 6;

    public dt: Date = new Date();

}

AngularComponent.new("CompetitionsComponent", CompetitionsComponent)
    .setTemplate(template)
    .register();


IOC.onRegister("navigationService", (navigationService: NavigationService) => {
    navigationService.addNavigationEntry(NavigationEntry.new()
        .setRoute("/")
        .setIndex(1)
        .setComponent(CompetitionsComponent)
        .setI18nLabel("navigation.competitions")
        .setIcon("fa fa-trophy")
        .setRequiresAuthentication(false)
        .setVisible(true)
        .setType("main")
        .setDefaultRoute(true)
    );
});
