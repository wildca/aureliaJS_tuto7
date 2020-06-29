import environment from '../environment';
import {Article} from '../models/Article';
import {Category} from '../models/Category';

/**
 * Data from this interface is restored from localStorage. Please dont introduce breaking changes.
 */
export interface Auth {
    host: string;
    isLoggedIn: boolean;
    password: string;
    token: string;
    username: string;
}

export enum SelectableBackend {
    ttrss = 'TTRSS',
    test = 'test',
}

export interface Route {
    name: string;
    params: object;
}

export interface Router {
    currentRoute: Route;
    newRoute: Route | null;
}

export interface RSS {
    isFetching: boolean;
    categories: Category[];
    currentCategoryId: string;
    // If an article is in this array, instead of marking it as read, we remove it from the list
    // of displayed articles.
    articlesToDiscards: Article[];
    displayedArticles: Article[];
}

export interface State {
    authentication: Auth;
    isOnline: boolean;
    router: Router;
    rss: RSS;
    selectableBackends: SelectableBackend[];
    selectedBackend: SelectableBackend;
}

const selectableBackends: SelectableBackend[] = [
    SelectableBackend.ttrss,
];

if (environment.debug) {
    selectableBackends.push(SelectableBackend.test);
}

export const initialState: State = {
    authentication: {
        host: '',
        isLoggedIn: false,
        password: '',
        username: '',
        token: '',
    },
    isOnline: true,
    router: {
        currentRoute: {
            name: '',
            params: {},
        },
        newRoute: null,
    },
    rss: {
        isFetching: false,
        categories: [],
        currentCategoryId: '',
        articlesToDiscards: [],
        displayedArticles: [],
    },
    selectableBackends,
    // Use the first backend of the list as the default backend.
    selectedBackend: selectableBackends[0],
};
