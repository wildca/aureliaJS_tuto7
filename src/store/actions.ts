import {State} from './state';

export function doRouterNavigation(state: State, newRouteName: string, newRouteParams: any = {}) {
    const newState = {...state};
    newState.router = {...state.router};
    newState.router.newRoute = {
        name: newRouteName,
        params: newRouteParams,
    };
    return newState;
}

export function isOffline(state: State) {
    const newState = {...state};
    newState.isOnline = false;
    return newState;
}

export function isOnline(state: State) {
    const newState = {...state};
    newState.isOnline = true;
    return newState;
}

export function logout(state: State) {
    const newState = {...state};
    newState.rss = {...state.rss};
    newState.authentication = {
        host: '',
        isLoggedIn: false,
        username: '',
        password: '',
        token: '',
    };
    newState.rss.articlesToDiscards = [];
    newState.rss.displayedArticles = [];
    newState.rss.categories = [];
    return doRouterNavigation(newState, 'login');
}

export function routerPerformedNavigation(
    state: State, currentRouteName: string, currentRouteParams,
) {
    const newState = {...state};
    newState.router = {...state.router};
    newState.rss = {...state.rss};
    newState.router.newRoute = null;
    newState.router.currentRoute = {
        name: currentRouteName,
        params: currentRouteParams,
    };

    if (currentRouteParams && currentRouteParams.categoryId) {
        newState.rss.currentCategoryId = currentRouteParams.categoryId.toString();
    } else {
        newState.rss.currentCategoryId = '';
    }

    return newState;
}
