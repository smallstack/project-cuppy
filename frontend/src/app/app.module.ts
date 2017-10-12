import { ApplicationRef, Injector, NgModule, NgZone } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { Event, NavigationStart, PreloadAllModules, Router, RouterModule } from "@angular/router";
/*
 * Platform and Environment providers/directives/pipes
 */
import { AppComponent } from "./app.component";
import { ROUTES } from "./app.routes";
import { ENV_PROVIDERS } from "./environment";

import { IOC } from "@smallstack/common";
import { HomeComponent } from "./views/home/Home";

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules })
    ],
    providers: [
        ENV_PROVIDERS
    ]
})
export class AppModule {

    constructor(public appRef: ApplicationRef, injector: Injector, ngZone: NgZone, router: Router) {
        IOC.register("angularInjector", injector);
        IOC.register("ngZone", ngZone);
        IOC.register("angularRouter", ngZone);

        router.events.subscribe((event: Event) => {

            // router hack to always scrollTop
            if (event instanceof NavigationStart) {
                try {
                    window.scrollTo(0, 0);
                } catch (e) {
                    // sometimes it seems we're just not in a window...
                }
            }

            // tell prerender that the requested route has been processed
            if (event instanceof NavigationEnd) {
                // tslint:disable-next-line:no-string-literal
                window["prerenderReady"] = true;
            }
        });
    }
}
