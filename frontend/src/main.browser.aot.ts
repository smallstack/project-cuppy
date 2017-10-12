import { platformBrowser } from "@angular/platform-browser";
import { NotificationService } from "@smallstack/core-common";
import { AppModuleNgFactory } from "../compiled/src/app/app.module.ngfactory";
import { decorateModuleRef } from "./app/environment";
import { initClient } from "./app/initClient";


export async function main(): Promise<any> {

    // bootstrap smallstack
    // Logger.debugMode = true;
    try {
        await initClient();
    } catch (e) {
        NotificationService.instance().getStandardErrorPopup(e);
        throw e;
    }
    return platformBrowser()
        .bootstrapModuleFactory(AppModuleNgFactory)
        .then(decorateModuleRef)
        .catch((err) => console.error(err));
}

switch (document.readyState) {
    case "loading":
        document.addEventListener("DOMContentLoaded", _domReadyHandler, false);
        break;
    case "interactive":
    case "complete":
    default:
        main();
}

function _domReadyHandler() {
    document.removeEventListener("DOMContentLoaded", _domReadyHandler, false);
    main();
}
