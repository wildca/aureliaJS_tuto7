import {doRouterNavigation, logout, routerPerformedNavigation} from '../../../src/store/actions';
import {State} from '../../../src/store/state';
import {createAuthInfos, createInitialState} from '../../__fixtures__/state-fixtures';

describe('actions', () => {
    let state: State;

    beforeEach(() => {
        state = createInitialState();
    });

    describe('doRouterNavigation', () => {
        it('should set the new route', () => {
            const newState = doRouterNavigation(state, '/new-route');

            expect(newState).toMatchSnapshot();
        });
    });

    describe('lougout', () => {
        it('should remove authentication infos and redirect to login page', () => {
            state.authentication = createAuthInfos();

            const newState = logout(state);

            expect(newState.authentication).toMatchSnapshot();
            expect(newState.router.newRoute).toEqual({
                name: 'login',
                params: {},
            });
        });
    });

    describe('routerPerformedNavigation', () => {
        it('should update the currentRoute and reset the new route', () => {
            state.router.newRoute = { name: '/new-route', params: {} };

            const newState = routerPerformedNavigation(state, '/current-route', {});

            expect(newState).toMatchSnapshot();
        });

        it('should update the currentRoute and reset the new route with route params', () => {
            state.router.newRoute = { name: '/new-route', params: {} };

            const newState = routerPerformedNavigation(state, '/current-route', { categoryId: 7 });

            expect(newState).toMatchSnapshot();
        });
    });
});
