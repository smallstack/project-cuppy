import { Autowired, NotificationService, IOC, NavigationService, NavigationEntry } from "@smallstack/core";
import { CompetitionsService, Competition } from "@smallstack/datalayer";
import { Angular2BaseComponentController, Angular2Component } from "@smallstack/meteor";
import { Router } from "@angular/router";

import * as _ from "underscore";

import template from "./CreateCompetitionComponent.html";


export class CreateCompetitionComponent extends Angular2BaseComponentController {

    @Autowired()
    private competitionsService: CompetitionsService;

    public newCompetition: Competition = new Competition();
    public types: string[] = _.toArray<string>(Competition.enums.type);

    public createCompetition(type: string) {
        this.newCompetition.type = type;
        this.competitionsService.createCompetition(this.newCompetition.name, this.newCompetition.type, (error: Error, competitionName: string) => {
            if (error)
                this.notificationService.getStandardErrorPopup(error, "Could not create new Competition!");
            else
                this.router.navigate(["competition", competitionName, "admin"]);
        });
    }

    public randomizeName(type: string) {
        let name: string = "";

        // weekday
        if (_.random(0, 100) > 60)
            name += new Array("Sunday ", "Monday ", "Tuesday ", "Wednesday ", "Thursday ",
                "Friday ", "Saturday ")[new Date().getDay()];

        // time of day
        if (_.random(0, 100) > 40) {
            let currentHour: number = new Date().getHours();
            if (currentHour < 6)
                name += "Night ";
            else if (currentHour < 12)
                name += "Morning ";
            else if (currentHour < 18)
                name += "Afternoon ";
            else if (currentHour < 21)
                name += "Evening ";
            else
                name += "Night ";
        }

        // competition time
        switch (type) {
            case "pingpong":
                name += _.sample<string>(["Ping Pong ", "Pong Pong ", "Peng Pong ", "Wong Pong ", "Table Tennis "]);
                break;
            default:
        }

        // random cup name thin
        name += _.sample<string>(["Cup", "Super Cup", "Tournament", "Derby", "Local Derby", "Breakdown", "Degradation", "World Cup", "Bowl", "Super Bowl", "Contest", "Fight", "Blast"]);

        this.newCompetition.name = name;
    }
}

Angular2Component.new("CreateCompetitionComponent", CreateCompetitionComponent)
    .setTemplate(template)
    .register();

IOC.onRegister("navigationService", (navigationService: NavigationService) => {
    navigationService.addNavigationEntry(NavigationEntry.new()
        .setRoute("/competitions/new")
        .setComponent(CreateCompetitionComponent)
        .setIndex(2)
        .setI18nLabel("navigation.newcompetition")
        .setIcon("fa fa-trophy")
        .setRequiresAuthentication(true, "/login")
        .setVisible(true)
        .setType("main")
    );
});
