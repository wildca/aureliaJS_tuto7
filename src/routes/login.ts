import {autoinject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import * as LogManager from 'aurelia-logging';
import {Store} from 'aurelia-store';
import {first, pluck} from 'rxjs/operators';
import {getBackend, selectBackend} from '../store/rss-backends-actions';
import {SelectableBackend, State} from '../store/state';

@autoinject()
export class Login {
    public host: string;
    public username: string;
    public password: string;
    public message: string;
    public selectableBackends: SelectableBackend[] = [];
    public selectedBackend: SelectableBackend;
    private logger;

    public constructor(private store: Store<State>, private i18n: I18N) {
        this.logger = LogManager.getLogger('aurss:routes:login');
    }

    public bind() {
        this.store.state
            .pipe(first())
            .subscribe((state) => {
                this.selectableBackends = state.selectableBackends;
                this.selectedBackend = state.selectedBackend;
            });

        // We use this only to fill the data initially. We discard any later updates.
        // If we don't, everything could be reset to empty strings here and thus in the form.
        this.store.state
            .pipe(pluck('authentication'))
            .pipe(first())
            .subscribe((authentication) => {
                this.host = authentication.host;
                this.username = authentication.username;
                this.password = authentication.password;
            });
    }

    public login(event) {
        event.preventDefault();
        this.message = '';

        this.logger.info(`Logging in with ${this.selectedBackend}`);
        return this.store.dispatch(selectBackend, this.selectedBackend)
            .then(() => getBackend(this.selectedBackend))
            .then(backend => backend.authenticate(this.host, this.username, this.password))
            .catch((e) => {
                this.logger.error(e);
                this.message = this.i18n.tr('login-page-authentication-failed-error-message');
            });
    }
}
