import { IOC, Autowired, NavigationEntry, NavigationService, QueryObject } from "@smallstack/core-common";
import { Angular2Component, Angular2BaseComponentController } from "@smallstack/meteor-client";
import { CompetitionsService, Competition } from "@smallstack/datalayer";

import template from "./HomeComponent.html";
import { Component } from "@angular/core";

@Component({
    template
})
export class HomeComponent extends Angular2BaseComponentController {

    @Autowired()
    private competitionsService: CompetitionsService;

    public competitions: Competition[];
    public queryObject: QueryObject<Competition>;
    public pageCount: number = 0;

    constructor() {
        super();
        this.queryObject = this.competitionsService.getAllCompetitions({}, { entriesPerPage: 5 });
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
                this.pageCount = Math.ceil(count / 5);
            });
        });
    }

    public onCompetitionSelect(competition: Competition) {
        console.log(competition);
        this.router.navigate(["competition", competition.name]);
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
        .setComponent(HomeComponent)
        .setLabel("Home")
        .setIcon("fa fa-home")
        .setRequiresAuthentication(false)
        .setVisible(true)
        .setType("main")
        .setDefaultRoute(true)
    );
});
