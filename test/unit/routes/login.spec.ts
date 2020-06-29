// import {Container} from 'aurelia-framework';
import {Login} from '../../../src/routes/login';
import {TestBackend} from '../../../src/services/backends/test';
import {createStore} from '../../__fixtures__/store-fixtures';
import {I18NStub} from '../../stubs';

const rssBackend = new TestBackend();
jest.mock('../../../src/store/rss-backends-actions', () => ({
    getBackend: jest.fn(() => rssBackend),
}));

describe('Login route', () => {
    let mockedI18n;
    let store;
    let sut;

    beforeEach(() => {
        localStorage.clear();

        store = createStore();
        mockedI18n = new I18NStub();
        sut = new Login(store, mockedI18n);
    });

    it('should not fill form values if no authentication infos exist', async() => {
        await sut.bind();

        expect(sut.host).toBe('');
    });

    it('should fill form values if authentication infos exist', async() => {
        store = createStore({
            authentication: {
                host: 'https://example.com',
                password: 'password',
                token: 'token',
                username: 'username',
            },
        });
        sut = new Login(store, mockedI18n);

        await sut.bind();

        expect(sut.host).toBe('https://example.com');
    });

    describe('login', async() => {
        it('should redirect to home if login succeeded', async() => {
            const event = {
                preventDefault: jest.fn(),
            };
            rssBackend.authenticate = jest.fn().mockImplementation(() => Promise.resolve());
            store.dispatch = jest.fn().mockImplementation(() => Promise.resolve());
            // Fetch initial values from the store.
            sut.bind();

            await sut.login(event);

            expect(sut.message).toBe('');
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it('should display error if log in failed', async() => {
            const event = {
                preventDefault: jest.fn(),
            };
            rssBackend.authenticate = jest.fn().mockImplementation(() => Promise.reject());

            await sut.login(event);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(sut.message).toContain('login-page-authentication-failed-error-message');
        });
    });
});
