import html from "rollup-plugin-html";
import sass from "rollup-plugin-sass";

export default {
    format: "umd",
    sourceMap: true,
    globals: {
        "@angular/core": "ng.core",
        "@angular/common": "ng.common",
        "@angular/compiler": "ng.compiler",
        "@angular/forms": "ng.forms",
        "@angular/platform-browser": "ng.platformBrowser",
        "@angular/platform-browser-dynamic": "ng.platformBrowserDynamic",
        "@angular/router": "ng.router",
        "angular2-meteor-polyfills": "ng.meteor.polyfills",
        "underscore": "underscore",
        "jquery": "jquery",
        "chance": "chance",
        "toastr": "toastr",
        "smallstack": "smallstack",
        "moment": "moment",
        "rxjs": "rxjs",
        "zone.js": "zone.js",
        "reflect-metadata": "reflect-metadata"
    },
    plugins: [
        html({
            include: "**/*.html",
            htmlMinifierOptions: {
                caseSensitive: true,
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        sass()
    ],
    external: [
        "@angular/core",
        "@angular/common",
        "@angular/compiler",
        "@angular/core",
        "@angular/http",
        "@angular/platform-browser",
        "@angular/platform-browser-dynamic",
        "@angular/router",
        "@angular/router-deprecated",
        "underscore",
        "moment",
        "jquery",
        "chance",
        "toastr",
        "smallstack",
        "rxjs",
        "zone.js",
        "reflect-metadata"
    ],
};
