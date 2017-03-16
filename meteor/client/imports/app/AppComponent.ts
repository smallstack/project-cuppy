import { Component, ViewEncapsulation } from "@angular/core";
import template from "./AppComponent.html";
import style from "./AppComponent.scss";
import { NavigationEntry, NavigationService, QueryObject } from "@smallstack/core-common";
import { Angular2BaseComponentController } from "@smallstack/meteor-client";

@Component({
    selector: "body",
    template,
    styles: [style]
})
export class AppComponent {

    public navigationEntries: NavigationEntry[];

    constructor() {
        this.navigationEntries = NavigationService.instance().getNavigationEntriesForNavigationType("main").sort((a: NavigationEntry, b: NavigationEntry) => a.index - b.index);
    }
}

