import {autoinject} from 'aurelia-framework';
import * as LogManager from 'aurelia-logging';
import {Redirect} from 'aurelia-router';
import {Store} from 'aurelia-store';
import {getBackend} from '../store/rss-backends-actions';
import {SelectableBackend, State} from '../store/state';

@autoinject()
export class AuthorizeStep {
    private logger;
    private selectedBackend: SelectableBackend;

    public constructor(private store: Store<State>) {
        this.logger = LogManager.getLogger('aurss:services:authorize');
        this.store.state.subscribe((state) => {
            this.selectedBackend = state.selectedBackend;
        });
    }

    public run(navigationInstruction, next) {
        let redirectToLogin;
        // We are trying to access the login page. Simply continue.
        if (navigationInstruction.config.name === 'login') {
            redirectToLogin = next;
        } else {
            redirectToLogin = () => next.cancel(new Redirect('login'));
        }

        this.logger.debug('Running authorize step.');
        const isAuthenticationRequired = navigationInstruction
            .getAllInstructions()
            .some((i) => i.config.settings.auth);

        if (!isAuthenticationRequired) {
            this.logger.debug('Authorization not required, continuing');
            return next();
        }

        this.logger.info(`Checking authorization with backend ${this.selectedBackend}`);
        return getBackend(this.selectedBackend)
            .isLoggedIn({ allowAutoLogin: true })
            .then((isLoggedIn) => isLoggedIn ? next() : redirectToLogin())
            .catch((error) => {
                this.logger.error('An error occurred in authentication step', error.stack);
                return redirectToLogin();
            });
    }
}
