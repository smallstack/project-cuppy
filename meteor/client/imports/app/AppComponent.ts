import { Component, ViewEncapsulation } from "@angular/core";
import template from "./AppComponent.html";
import style from "./AppComponent.scss";
import { NavigationEntry, NavigationService, QueryObject } from "@smallstack/core";
import { Angular2BaseComponentController } from "@smallstack/meteor";

@Component({
    selector: "body",
    template,
    styles: [style]
})
export class AppComponent extends Angular2BaseComponentController {

    public navigationEntries: NavigationEntry[];

    constructor() {
        super();
        this.navigationEntries = NavigationService.instance().getNavigationEntriesForNavigationType("main");
    }

}

