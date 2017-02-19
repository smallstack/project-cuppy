import "toastr";
import "zone.js";
import "reflect-metadata";
import "angular2-meteor-polyfills";
import * as _ from 'underscore';
import { enableProdMode } from "@angular/core";
import { InitLevelService, IOC, Logger, ConfigurationService, Configuration } from "@smallstack/core";
import { initClient } from "@smallstack/core";
import { LocalizationService, QueryObject } from "@smallstack/core";
import { initMeteorShared, bootstrapAngular } from "@smallstack/meteor";
import { createDatalayerCollections, registerDatalayerServices, initializeTypesystem } from "@smallstack/datalayer";
import { AppComponent } from "./imports/app/AppComponent";
import { HomeComponent } from "./imports/home/HomeComponent";


if (Meteor.isProduction)
    enableProdMode();

createDatalayerCollections();
initMeteorShared();
initClient();
registerDatalayerServices();
initializeTypesystem();

// include backoffices and other components
import "./imports/login/LoginComponent";
import "./imports/competition-create/CreateCompetitionComponent";
import "./imports/competition/CompetitionComponent";

let initLevelService: InitLevelService = IOC.get<InitLevelService>("initLevelService");

initLevelService.addInitLevelFn(15, "I18N", (cb: (error: Error, success: boolean) => void) => {
    let languageKey: string = LocalizationService.instance().getCurrentLanguage();
    LocalizationService.instance().getLocalizationsForLanguage({ languageKey }, { entriesPerPage: 5000000 }).subscribe(() => {
        cb(undefined, true);
    })
});

initLevelService.addInitLevelFn(10, "ConfigurationSync", (cb: (error: Error, success: boolean) => void) => {
    ConfigurationService.instance().initOnClient(cb);
});


initLevelService.addInitLevelFn(100, "Angular2", (cb: (error: Error, success: boolean) => void) => {
    bootstrapAngular(AppComponent, [HomeComponent], () => {
        cb(undefined, true);
    });
});


Meteor.startup(() => {
    InitLevelService.instance().execute();
});

