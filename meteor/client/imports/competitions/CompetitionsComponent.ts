import { IOC, Autowired, NavigationEntry, NavigationService, QueryObject } from "@smallstack/core-common";
import { AngularComponent, AngularBaseComponentController } from "@smallstack/core-client";
import { CompetitionsService, Competition } from "@smallstack/datalayer";

import template from "./CompetitionsComponent.html";
import { Component } from "@angular/core";


export class CompetitionsComponent extends AngularBaseComponentController {

    @Autowired()
    private competitionsService: CompetitionsService;

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
