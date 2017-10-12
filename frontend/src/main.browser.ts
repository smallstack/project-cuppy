import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { Logger } from "@smallstack/common";
import { NotificationService } from "@smallstack/core-common";
import { AppModule } from "./app/app.module";
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
    return platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .then(decorateModuleRef)
        .catch((err) => Logger.error("main", "Application Bootstrapping failed!", err));
}

/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
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
