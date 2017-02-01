import html from 'rollup-plugin-html';
import sass from 'rollup-plugin-sass';

export default {
    format: 'umd',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/compiler': 'ng.compiler',
        '@angular/forms': 'ng.forms',
        '@angular/platform-browser': 'ng.platformBrowser',
        '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
        '@angular/router': 'ng.router',
        'angular2-meteor-polyfills': 'ng.meteor.polyfills',
        'underscore': 'underscore'
    },
    plugins: [
        html({
            include: '**/*.html'
        }),
        sass()
    ],
    external: [
        '@angular/core',
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/router-deprecated'
    ],
};
