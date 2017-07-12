import "toastr";
import "zone.js";
import "reflect-metadata";
import "angular2-meteor-polyfills";
import * as _ from 'underscore';
import { enableProdMode } from "@angular/core";
import { InitLevelService, IOC, Logger, ConfigurationService, Configuration } from "@smallstack/core-common";
import { LocalizationService, QueryObject } from "@smallstack/core-common";
import { bootstrapAngular } from "@smallstack/meteor-client";
import { createDatalayerCollections, registerDatalayerServices, initializeTypesystem } from "@smallstack/datalayer";
import { CompetitionsComponent } from "./imports/competitions/CompetitionsComponent";

import "./imports/initClient";
import { initClient, startClient } from "./imports/initClient";

import { AppComponent } from "./imports/app/AppComponent";

initClient();

// include backoffices and other components
import "./imports/login/LoginComponent";
import "./imports/logout/LogoutComponent";
import "./imports/competition-create/CreateCompetitionComponent";
import "./imports/competition/CompetitionComponent";
import "./imports/competitions/CompetitionsComponent";
import "./imports/competition-admin/CompetitionAdminComponent";


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
    bootstrapAngular(AppComponent, [CompetitionsComponent], () => {
        cb(undefined, true);
    });
});

startClient(AppComponent, []);

