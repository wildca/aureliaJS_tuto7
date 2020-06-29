import {rehydrateFromLocalStorage} from 'aurelia-store';
import {State} from './state';

export function rehydratePartiallyFromLocalStorage(state: State, key?: string) {
    const stateFromLocalStorage: State = rehydrateFromLocalStorage(state, key);
    const newState = {...state};
    if (stateFromLocalStorage.authentication) {
        newState.authentication = stateFromLocalStorage.authentication;
    }

    return newState;
}
