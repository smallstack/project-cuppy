import { AngularComponent } from "@smallstack/core-client";
import { NavigationEntry, NavigationService } from "@smallstack/core-common";
import template from "./FrontendComponent.html";

export class FrontendComponent {

    public navigationEntries: NavigationEntry[];

    constructor() {
        this.navigationEntries = NavigationService.instance().getNavigationEntriesForNavigationType("main").sort((a: NavigationEntry, b: NavigationEntry) => a.index - b.index);
    }
}

AngularComponent.new("FrontendComponent", FrontendComponent)
    .setTemplate(template)
    .register();
