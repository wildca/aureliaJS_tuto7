import {PLATFORM, autoinject} from 'aurelia-framework';
import {Subscription as EaSubscription, EventAggregator} from 'aurelia-event-aggregator';
import {I18N} from 'aurelia-i18n';
import * as LogManager from 'aurelia-logging';
import {Router, RouterConfiguration} from 'aurelia-router';
import {
    MiddlewarePlacement,
    Store,
    dispatchify,
    localStorageMiddleware,
} from 'aurelia-store';
import {Subscription as RxjsSubscription} from 'rxjs';
import {pluck} from 'rxjs/operators';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import * as constants from './constants';
import {AuthorizeStep} from './services/authorize';
import {
    doRouterNavigation, isOffline, isOnline, logout, routerPerformedNavigation,
} from './store/actions';
import {rehydratePartiallyFromLocalStorage} from './store/middlewares';
import {fetchArticles, fetchCategories, registerRssBackendsActions} from './store/rss-backends-actions';
import {State} from './store/state';

@autoinject()
export class App {
    public burgerMenuExpanded: boolean = false;
    public router: Router;
    public state: State;
    public readonly fetchArticlesForCategory: (_categoryId: string) => void;
    private readonly onOffline: () => void;
    private readonly onOnline: () => void;
    private logger = LogManager.getLogger('aurss:app');
    private refreshIntervalSubscription;
    private storeSubscriptions: RxjsSubscription[] = [];
    private eaSubscriptions: EaSubscription[] = [];

    public constructor(
        private store: Store<State>, private ea: EventAggregator, private i18n: I18N,
    ) {
        this.store.registerMiddleware(
            localStorageMiddleware,
            MiddlewarePlacement.After,
            { key: constants.STATE_STORAGE_KEY },
        );
        this.store.registerAction('Rehydrate', rehydratePartiallyFromLocalStorage);
        this.store.dispatch(rehydratePartiallyFromLocalStorage, constants.STATE_STORAGE_KEY);

        this.store.registerAction(isOffline.name, isOffline);
        this.store.registerAction(isOnline.name, isOnline);
        this.store.registerAction(logout.name, logout);
        this.store.registerAction(doRouterNavigation.name, doRouterNavigation);
        this.store.registerAction(routerPerformedNavigation.name, routerPerformedNavigation);

        registerRssBackendsActions(this.store);

        this.onOffline = () => this.store.dispatch(isOffline.name);
        this.onOnline = () => this.store.dispatch(isOnline.name);
        this.fetchArticlesForCategory = dispatchify(fetchArticles);
    }

    public configureRouter(config: RouterConfiguration, router: Router) {
        this.router = router;
        // Note: the authorize step will be run before activating any route.
        // Thus we can load authentication infos here to make sure they will be
        // defined later on.
        config.addAuthorizeStep(AuthorizeStep);
        config.title = 'aurss';
        config.map([
            {
                moduleId: PLATFORM.moduleName('routes/display-articles-from-category'),
                name: 'display-articles-from-category',
                nav: false,
                route: ['/articles/categories/:categoryId'],
                settings: {auth: true},
                title: this.i18n.tr('router-title-display-articles-from-category'),
            },
            {
                moduleId: PLATFORM.moduleName('routes/login'),
                name: 'login',
                route: 'login',
                title: this.i18n.tr('router-title-login'),
            },
        ]);
        config.fallbackRoute('login');

        this.eaSubscriptions.push(this.ea.subscribe('router:navigation:complete', (event) => {
            this.store.dispatch(
                routerPerformedNavigation, event.instruction.fragment, event.instruction.params,
            );
        }));

        this.storeSubscriptions.push(this.store.state.subscribe((state) => {
            if (!this.router.currentInstruction) {
                return;
            } else if (!state.router.newRoute) {
                return;
            } else if (state.router.currentRoute.name === state.router.newRoute.name) {
                return;
            }

            this.router.navigateToRoute(state.router.newRoute.name, state.router.newRoute.params);
        }));
    }

    public attached() {
        this.setUpOfflineNotification();
        this.setUpServiceWorker();
        this.storeSubscriptions.push(
            this.store.state.subscribe((state) => this.state = state),
        );
        // We do this as soon as we have a token. Once it is done, we only refetched if the token
        // has changed.
        let currentToken = '';
        this.storeSubscriptions.push(this.store.state.pipe(pluck('authentication'))
            .subscribe((authentication) => {
                if (authentication.isLoggedIn && authentication.token !== currentToken) {
                    this.store.dispatch(fetchCategories);
                    currentToken = authentication.token;
                    setInterval(() => {
                        this.store.dispatch(fetchArticles, this.state.rss.currentCategoryId);
                        this.store.dispatch(fetchCategories);
                    }, constants.REFRESH_INTERVAL);
                }
            }));
    }

    public detached() {
        this.storeSubscriptions.forEach((sub) => sub.unsubscribe());
        this.eaSubscriptions.forEach((sub) => sub.dispose());
        window.removeEventListener('offline', this.onOffline);
        window.removeEventListener('online', this.onOnline);
    }

    public logout() {
        clearInterval(this.refreshIntervalSubscription);
        this.store.dispatch(logout.name);
    }

    public toggleBurgerMenu() {
        this.burgerMenuExpanded = !this.burgerMenuExpanded;
    }

    private setUpOfflineNotification() {
        if (!navigator.onLine) {
            this.store.dispatch(isOffline.name);
        } else {
            this.store.dispatch(isOnline.name);
        }

        window.addEventListener('offline', this.onOffline);
        window.addEventListener('online', this.onOnline);
    }

    private setUpServiceWorker() {
        if ('serviceWorker' in navigator) {
            runtime.register()
                .then((registration) => this.logger.info('Service worker is registered', registration))
                .catch((registrationError) => this.logger.error(
                    'Service worker failed to register', registrationError,
                ));
        } else {
            this.logger.info('Service worker is not available in this browser.');
        }
    }
}
