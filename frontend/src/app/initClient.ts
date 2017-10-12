// tslint:disable:ordered-imports

import { IOC, InitLevelService, DataBridge, Logger } from "@smallstack/common";

// import { IOC, InitLevelService, LocalizationService, ConfigurationService, NavigationService } from "@smallstack/core-common";
import { registerDatalayerServices, initializeTypesystem, GaragesService, MapmarkersService } from "@smallstack/datalayer";
import { initFrontend } from "@smallstack/frontend-web";
import { File, S3FilesService, Configuration, ConfigurationService, QueryObject, PagesService, Page, LocalizationService } from "@smallstack/core-common";
import { ComponentsRegistry } from "@smallstack/components";

export function initClient(): Promise<any> {


    // createDatalayerCollections();
    // initCoreCommon(false);
    // initCoreClient();
    registerDatalayerServices();
    initializeTypesystem();
    initFrontend();

    // init core stuffd
    IOC.register("File", File);
    const configurationService: ConfigurationService = new ConfigurationService();
    configurationService.set("google.maps.apikey", "AIzaSyDc48NG1HLoKla5RK1GgZfilKogmqtSxgE", "everywhere");
    IOC.register("Configuration", Configuration);
    IOC.register("configurationService", configurationService);
    IOC.register("filesService", new S3FilesService());
    IOC.register("localizationService", new LocalizationService());
    IOC.register("componentsRegistry", new ComponentsRegistry());
    IOC.register("pagesService", new PagesService());
    IOC.register("Page", Page);

    IOC.onRegister("initLevelService", (initLevelService: InitLevelService) => {
        initLevelService.execute();
    });


    // IOC.onRegister("initLevelService", (initLevelService: InitLevelService) => {
    //     initLevelService.addInitLevelFn(15, "I18N", (cb: (error: Error, success: boolean) => void) => {
    //         const languageKey: string = LocalizationService.instance().getCurrentLanguage();
    //         LocalizationService.instance().getLocalizationsForLanguage({ languageKey }, { entriesPerPage: 5000000 }).subscribe(() => {
    //             cb(undefined, true);
    //         });
    //     });
    //     initLevelService.addInitLevelFn(10, "ConfigurationSync", (cb: (error: Error, success: boolean) => void) => {
    //         ConfigurationService.instance().initOnClient(cb);
    //     });
    // });

    // sync stuff after all services were registered
    return Promise.all([
        new Promise<void>((resolve, reject) => {
            IOC.onRegister("garagesService", (garagesService: GaragesService) => {
                garagesService.getAllGarages({}, { entriesPerPage: 100 }).syncViaJSONAPI((error: Error) => {
                    if (error)
                        reject(error);
                    else {
                        Logger.info("InitClient", "Garages synced successfully!");
                        resolve();
                    }
                });
            });
        }),
        new Promise<void>((resolve, reject) => {
            IOC.onRegister("mapmarkersService", (mapmarkersService: MapmarkersService) => {
                mapmarkersService.getAllMapMarkers({}, { entriesPerPage: 100 }).syncViaJSONAPI((error: Error) => {
                    if (error)
                        reject(error);
                    else
                        resolve();
                });
            });
        }),
        new Promise<void>((resolve, reject) => {
            IOC.onRegister("dataBridge", (dataBridge: DataBridge) => {
                dataBridge.httpCall("GET", "garagefiles", {}).then((result: any[]) => {
                    const garageFiles: { [id: string]: File } = {};
                    if (result instanceof Array) {
                        for (const file of result) {
                            garageFiles[file.id] = file;
                        }
                    }
                    dataBridge.setSessionVariable("garageFiles", garageFiles);
                    resolve();
                }).catch((e) => { reject(e); });
            });
        }),
        new Promise<void>((resolve, reject) => {
            configurationService.getConfiguration({}, { entriesPerPage: 10000 }).syncViaJSONAPI((error: Error, queryObject: QueryObject<Configuration>) => {
                if (error)
                    reject(error);
                else {
                    queryObject.getModels((configurations: Configuration[]) => {
                        for (const configuration of configurations) {
                            configurationService.set(configuration.key, configuration.value, configuration.scope);
                        }
                        resolve();
                    });
                }
            });
        })
    ]);
}

// export function startClient(AppComponent: any, additionalComponents: any[]) {

//     IOC.onRegister("initLevelService", (initLevelService: InitLevelService) => {
//         IOC.onRegister("navigationService", (navigationService: NavigationService) => {

//             initLevelService.addInitLevelFn(100, "Angular2", (cb: (error: Error, success: boolean) => void) => {
//                 bootstrapAngular(AppComponent, additionalComponents, () => {
//                     cb(undefined, true);
//                 });
//             });

//             Meteor.startup(() => {
//                 initLevelService.execute();
//             });
//         });
//     });

// }
