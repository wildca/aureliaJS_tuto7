// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import { EventAggregator } from 'aurelia-event-aggregator';
import { Aurelia } from 'aurelia-framework';
import { TCustomAttribute } from 'aurelia-i18n';
import { PLATFORM } from 'aurelia-pal';
import {AppRouter} from 'aurelia-router';
import { LogLevel } from 'aurelia-store';
import * as Bluebird from 'bluebird';
import Backend from 'i18next-xhr-backend';
import environment from './environment';
import { initialState } from './store/state';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
            const aliases = ['t', 'i18n'];
            TCustomAttribute.configureAliases(aliases);

            instance.i18next.use(Backend);

            return instance.setup({
                attributes: aliases,
                backend: {
                    loadPath: 'locales/{{lng}}/{{ns}}.json',
                },
                debug: environment.debug,
                fallbackLng: 'en',
                lng: navigator.language.split('-')[0],
            }).then(() => {
                const router: AppRouter = aurelia.container.get(AppRouter);
                router.transformTitle = (title) => instance.tr(title);

                const ea: EventAggregator = aurelia.container.get(EventAggregator);
                ea.subscribe('i18n:local:changed', () => {
                    router.updateTitle();
                });
            });
        })
        .feature(PLATFORM.moduleName('resources/index'));

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-store'), {
        initialState,
        logDefinitions: {
            dispatchedActions: LogLevel.debug,
        },
        logDispatchedActions: environment.debug,
    });

    // Uncomment the line below to enable animation.
    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
    // if the css animator is enabled, add swap-order="after" to all router-view elements

    // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
    // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

    aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

    if (environment.testing) {
        aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
    }

    return aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
