import "toastr";
import "zone.js";
import "reflect-metadata";
import "angular2-meteor-polyfills";
import * as _ from 'underscore';


import { enableProdMode } from "@angular/core";

import { InitLevelService, IOC } from "smallstack";
import { clientInit, bootstrapAngular } from "smallstack";
import { LocalizationService } from "smallstack";

import { createDatalayerCollections, registerDatalayerServices } from "smallstack-datalayer";

import { AppComponent } from "./imports/app/AppComponent";

import "./imports/home/home";


if (Meteor.isProduction)
    enableProdMode();

clientInit();
createDatalayerCollections();
registerDatalayerServices();
let initLevelService: InitLevelService = IOC.get<InitLevelService>("initLevelService");


initLevelService.addInitLevelFn(15, "I18N", (cb: (error: Error, success: boolean) => void) => {
    let languageKey: string = LocalizationService.instance().getCurrentLanguage();
    LocalizationService.instance().getLocalizationsForLanguage({ languageKey }, { entriesPerPage: 5000000 }).subscribe(() => {
        cb(undefined, true);
    })
});


initLevelService.addInitLevelFn(100, "Angular2", (cb: (error: Error, success: boolean) => void) => {
    bootstrapAngular(AppComponent, () => {
        cb(undefined, true);
    });
});
