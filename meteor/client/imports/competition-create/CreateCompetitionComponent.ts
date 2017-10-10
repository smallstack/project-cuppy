import { AngularBaseComponentController, AngularComponent } from "@smallstack/core-client";
import { Autowired, IOC, NavigationEntry, NavigationService } from "@smallstack/core-common";
import { Competition, CompetitionsService } from "@smallstack/datalayer";
import * as _ from "underscore";
import template from "./CreateCompetitionComponent.html";

export class CreateCompetitionComponent extends AngularBaseComponentController {

    public newCompetition: Competition = new Competition();
    public types: string[] = _.toArray<string>(Competition.enums.type);

    @Autowired()
    private competitionsService: CompetitionsService;

    public createCompetition(type: "quickMatch" | "tournament" | "league") {
        this.newCompetition.type = type;
        this.competitionsService.createCompetition(this.newCompetition.name, this.newCompetition.type, "football3210", (error: Error, competitionName: string) => {
            if (error)
                this.notificationService.getStandardErrorPopup(error, "Could not create new Competition!");
            else {
                this.ngZone.run(() => {
                    this.router.navigate(["competition", competitionName, "admin"]);
                });
            }
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
            const currentHour: number = new Date().getHours();
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

        // random cup name thing
        name += _.sample<string>(["Cup", "Super Cup", "Tournament", "Derby", "Local Derby", "Breakdown", "Degradation", "World Cup", "Bowl", "Super Bowl", "Contest", "Fight", "Blast"]);

        this.newCompetition.name = name;
    }
}

AngularComponent.new("CreateCompetitionComponent", CreateCompetitionComponent)
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

