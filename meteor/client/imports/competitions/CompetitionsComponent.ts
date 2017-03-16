import { IOC, Autowired, NavigationEntry, NavigationService, QueryObject } from "@smallstack/core-common";
import { Angular2Component, Angular2BaseComponentController } from "@smallstack/meteor-client";
import { CompetitionsService, Competition } from "@smallstack/datalayer";

import template from "./CompetitionsComponent.html";
import { Component } from "@angular/core";

@Component({
    template
})
export class CompetitionsComponent extends Angular2BaseComponentController {

    @Autowired()
    private competitionsService: CompetitionsService;

    public competitions: Competition[];
    public queryObject: QueryObject<Competition>;
    public pageCount: number = 0;
    public entriesPerPage: number = 6;

    public dt: Date = new Date();

    constructor() {
        super();
        this.queryObject = this.competitionsService.getAllCompetitions({}, { entriesPerPage: this.entriesPerPage });
        console.log("subscribing to all competitions!");
        this.queryObject.subscribe((error: Error, queryObject: QueryObject<Competition>) => {
            console.log("successfully subscribed to all competitions!");
            this.ngZone.run(() => {
                this.competitions = queryObject.getModels();
                console.log("all competitions!", this.competitions);
            });
        });
        this.queryObject.getCount((count: number) => {
            this.ngZone.run(() => {
                this.pageCount = Math.ceil(count / this.entriesPerPage);
            });
        });
    }

    public pageChange(pageNumber: number) {
        console.log(pageNumber);
        this.queryObject.getPage(pageNumber, (models: Competition[]) => {
            this.competitions = models;
        });
    }

}

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
