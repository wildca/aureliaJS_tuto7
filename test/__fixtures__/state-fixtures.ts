import {Auth, SelectableBackend, State, initialState} from '../../src/store/state';

export const createInitialState = (): State => {
    const state: State = JSON.parse(JSON.stringify(initialState));
    state.selectedBackend = SelectableBackend.test;
    return state;
};

export const createAuthInfos = (): Auth => {
    return {
        host: 'https://rss.example.com',
        isLoggedIn: true,
        password: 'fake-password',
        token: 'fake-token',
        username: 'my-username',
    };
};
