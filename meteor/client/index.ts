import "./imports/initClient";

import { enableProdMode } from "@angular/core";
import { LocalizationService, QueryObject } from "@smallstack/core-common";
import { Configuration, ConfigurationService, InitLevelService, IOC, Logger } from "@smallstack/core-common";
import { createDatalayerCollections, initializeTypesystem, registerDatalayerServices } from "@smallstack/datalayer";
import { bootstrapAngular } from "@smallstack/meteor-client";
import * as _ from "underscore";
import { AppComponent } from "./imports/app/AppComponent";
import { CompetitionsComponent } from "./imports/competitions/CompetitionsComponent";
import { initClient, startClient } from "./imports/initClient";

initClient();

// include backoffices and other components
import { FrontendComponent } from "./imports/app/FrontendComponent";
import "./imports/competition-admin/CompetitionAdminComponent";
import "./imports/competition-create/CreateCompetitionComponent";
import "./imports/competition/CompetitionComponent";
import "./imports/competitions/CompetitionsComponent";
import "./imports/components/match-row-entry/MatchRowEntry";
import "./imports/login/LoginComponent";
import "./imports/logout/LogoutComponent";

const initLevelService: InitLevelService = IOC.get<InitLevelService>("initLevelService");

initLevelService.addInitLevelFn(15, "I18N", (cb: (error: Error, success: boolean) => void) => {
    const languageKey: string = LocalizationService.instance().getCurrentLanguage();
    LocalizationService.instance().getLocalizationsForLanguage({ languageKey }, { entriesPerPage: 5000000 }).subscribe(() => {
        cb(undefined, true);
    });
});

initLevelService.addInitLevelFn(10, "ConfigurationSync", (cb: (error: Error, success: boolean) => void) => {
    ConfigurationService.instance().initOnClient(cb);
});


initLevelService.addInitLevelFn(100, "Angular2", (cb: (error: Error, success: boolean) => void) => {
    bootstrapAngular(AppComponent, [CompetitionsComponent], () => {
        cb(undefined, true);
    });
});

startClient(AppComponent, [FrontendComponent]);

