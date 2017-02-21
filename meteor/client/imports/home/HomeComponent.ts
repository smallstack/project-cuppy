import { IOC, Autowired, NavigationEntry, NavigationService, QueryObject } from "@smallstack/core";
import { Angular2Component, Angular2BaseComponentController } from "@smallstack/meteor";
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

    constructor() {
        super();
        this.competitionsService.getAllCompetitions().subscribe((error: Error, queryObject: QueryObject<Competition>) => {
            this.ngZone.run(() => {
                this.competitions = queryObject.getModels();
            });
        });
    }

    public onCompetitionSelect(competition: Competition) {
        console.log(competition);
        this.router.navigate(["competition", competition.name]);
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
