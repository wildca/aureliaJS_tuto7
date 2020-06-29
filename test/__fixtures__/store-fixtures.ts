import {Store} from 'aurelia-store';
import {createInitialState} from './state-fixtures';

export const createStore = (state = {}) => {
    const initialState = {
        ...createInitialState(),
        ...state,
    };
    const store = new Store(initialState);

    return store;
};
