import "./imports/initClient";

import { LocalizationService } from "@smallstack/core-common";
import { ConfigurationService, InitLevelService, IOC } from "@smallstack/core-common";
import { bootstrapAngular } from "@smallstack/meteor-client";
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

initLevelService.addInitLevelFn({
    level: 15,
    identifier: "I18N",
    fn: () => new Promise<void>((resolve, reject) => {
        const languageKey: string = LocalizationService.instance().getCurrentLanguage();
        LocalizationService.instance().getLocalizationsForLanguage({ languageKey }, { entriesPerPage: 5000000 }).subscribe(() => {
            resolve();
        });
    })
});

initLevelService.addInitLevelFn({
    level: 10,
    identifier: "ConfigurationSync",
    fn: () => new Promise<void>((resolve, reject) => {
        ConfigurationService.instance().initOnClient((error: Error, result: any) => {
            if (error)
                reject(error);
            else
                resolve();
        });
    })
});


initLevelService.addInitLevelFn({
    level: 100,
    identifier: "Angular2",
    fn: () => new Promise<void>((resolve, reject) => {
        bootstrapAngular(AppComponent, [CompetitionsComponent], () => {
            resolve();
        });
    })
});

startClient(AppComponent, [FrontendComponent]);

