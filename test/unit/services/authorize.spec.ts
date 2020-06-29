import {AuthorizeStep} from '../../../src/services/authorize';
import {TestBackend} from '../../../src/services/backends/test';
import {createStore} from '../../__fixtures__/store-fixtures';
import {NavigationInstruction} from '../../stubs';

const rssBackend = new TestBackend();
jest.mock('../../../src/store/rss-backends-actions', () => ({
    getBackend: jest.fn(() => rssBackend),
}));


describe('Authorize step', () => {
    const authLocalStorageKey = 'aurssAuth';
    let sut;
    let defaultNavigationInstructions;
    let defaultNavigationConfig;
    let navigationInstruction;
    let next;

    beforeEach(() => {
        localStorage.clear();

        const store = createStore();

        sut = new AuthorizeStep(store);

        defaultNavigationConfig = Object.freeze({
            name: 'display-articles-from-category',
            settings: Object.freeze({}),
        });
        defaultNavigationInstructions = [{ config: defaultNavigationConfig }];
        navigationInstruction = new NavigationInstruction(
            defaultNavigationInstructions, defaultNavigationConfig,
        );

        next = jest.fn();
        next.cancel = jest.fn();
    });

    describe('when navigating to an auth protected page', () => {
        describe('with auth infos', () => {
            beforeEach(() => {
                localStorage.setItem(authLocalStorageKey, JSON.stringify({
                    host: 'https://example.com',
                    password: 'password',
                    token: 'token',
                    username: 'username',
                }));
            });

            it('should continue if auth is not required', async() => {
                spyOn(rssBackend, 'isLoggedIn');

                await sut.run(navigationInstruction, next);

                expect(rssBackend.isLoggedIn).not.toHaveBeenCalled();
                expect(next.cancel).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });

            describe('when auth is required', () => {
                beforeEach(() => {
                    const navigationConfig = Object.freeze({
                        name: 'display-articles-from-category',
                        settings: Object.freeze({
                            auth: true,
                        }),
                    });
                    const navigationInstructions = [{config: navigationConfig}];

                    navigationInstruction = new NavigationInstruction(
                        navigationInstructions, navigationConfig,
                    );
                });

                it('should continue if we are logged in', async() => {
                    rssBackend.isLoggedIn = jest.fn().mockReturnValue(Promise.resolve(true));

                    await sut.run(navigationInstruction, next);

                    expect(rssBackend.isLoggedIn).toHaveBeenCalled();
                    expect(next.cancel).not.toHaveBeenCalled();
                    expect(next).toHaveBeenCalled();
                });

                it('should cancel if we are not logged in', async() => {
                    rssBackend.isLoggedIn = jest.fn().mockReturnValue(Promise.resolve(false));

                    await sut.run(navigationInstruction, next);

                    expect(rssBackend.isLoggedIn).toHaveBeenCalled();
                    expect(next.cancel).toHaveBeenCalled();
                    expect(next).not.toHaveBeenCalled();
                });

                it('should cancel if an error occurred while talking to the backend', async() => {
                    rssBackend.isLoggedIn = jest.fn().mockReturnValue(
                        Promise.reject(new Error('oops')),
                    );

                    await sut.run(navigationInstruction, next);

                    expect(rssBackend.isLoggedIn).toHaveBeenCalled();
                    expect(next.cancel).toHaveBeenCalled();
                    expect(next).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('when navigating to login page', () => {
        beforeEach(() => {
            navigationInstruction = new NavigationInstruction([], {
                name: 'login',
            });
        });

        it('should pass to login page if no auth infos can be found', async() => {
            await sut.run(navigationInstruction, next);

            expect(next).toHaveBeenCalled();
            expect(next.cancel).not.toHaveBeenCalled();
        });
    });
});
