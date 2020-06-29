import {Container} from 'aurelia-framework';
import * as LogManager from 'aurelia-logging';
import {Store} from 'aurelia-store';
import * as constants from '../constants';
import {Article} from '../models/Article';
import {Category} from '../models/Category';
import {Counter} from '../models/Counter';
import {Backend} from '../services/backend';
import {TestBackend} from '../services/backends/test';
import {TTRss} from '../services/backends/ttrss';
import {doRouterNavigation} from './actions';
import {Auth, SelectableBackend, State} from './state';

const logger = LogManager.getLogger('aurss:store:actions:rss');

export function selectBackend(state: State, selectedBackend: SelectableBackend) {
    const newState = {...state};
    newState.selectedBackend = selectedBackend;
    return newState;
}

/**
 * This action is meant to be called when the authenticate method of the backend succeeds.
 * @param state
 * @param authInfos
 */

export function authenticateSucceeded(state: State, authInfos: Auth) {
    const newState = Object.assign({}, state);
    newState.authentication = authInfos;
    return doRouterNavigation(
        newState, 'display-articles-from-category', { categoryId: constants.DEFAULT_CATEGORY},
    );
}

/**
 * This action is meant to be called when the isLoggedIn method of the backend returns true.
 * @param state
 */
export function isLoggedIn(state: State) {
    const newState = {...state};
    newState.authentication = {...state.authentication};
    newState.authentication.isLoggedIn = true;
    return newState;
}

export function fetchArticles(state: State, categoryId: string) {
    const newState = {...state};
    newState.rss = {...state.rss};
    newState.rss.isFetching = true;

    getBackend(state.selectedBackend).getArticles(categoryId);

    return newState;
}

export function receivedArticles(state: State, articles: Article[]) {
    const newState = {...state};
    newState.rss = {...state.rss};
    newState.rss.isFetching = false;
    newState.rss.displayedArticles = articles;

    return newState;
}

export function fetchCategories(state: State) {
    getBackend(state.selectedBackend).getCategories();
    return state;
}

export function receivedCategories(state: State, categories: Category[]) {
    const newState = {...state};
    newState.rss = {...state.rss};
    newState.rss.categories = categories;

    return newState;
}

export function fetchCounters(state: State) {
    getBackend(state.selectedBackend).getCounters();
    return state;
}

export function receivedCounters(state: State, counters: Counter[]) {
    const newState = {...state};
    newState.rss = {...state.rss};

    const categoryIdToCounters = counters.reduce((acc, counter) => {
        acc[counter.categoryId] = counter.unreadCount;
        return acc;
    }, {});

    newState.rss.categories = state.rss.categories.map((category) => ({
        ...category,
        unreadCount: categoryIdToCounters[category.id],
    }));

    return newState;
}

/**
 * Do a request to the backend to mark an article as read.
 * @param state
 * @param article
 * @param discard: If this is true, the article will be added to articlesToDiscards.
 */
export function markAsRead(state: State, article: Article, { discard = false } = {}) {
    getBackend(state.selectedBackend).markAsRead(article);
    if (!discard) {
        return state;
    }
    const newState = {...state};
    newState.rss = {...newState.rss};
    newState.rss.articlesToDiscards = [
        ...newState.rss.articlesToDiscards,
        article,
    ];

    return newState;
}

export function markAsUnread(state: State, article: Article) {
    getBackend(state.selectedBackend).markAsUnread(article);
    return state;
}

export function markAsFavorite(state: State, article: Article) {
    getBackend(state.selectedBackend).markAsFavorite(article);
    return state;
}

export function unmarkAsFavorite(state: State, article: Article) {
    getBackend(state.selectedBackend).unmarkAsFavorite(article);
    return state;
}

export function markedAsRead(state: State, article: Article) {
    fetchCounters(state);
    if (state.rss.articlesToDiscards.includes(article)) {
        return removeArticle(state, article);
    }

    return updateArticle(state, article, { isRead: true });
}

function removeArticle(state: State, article: Article) {
    if (!state.rss.displayedArticles.includes(article)) {
        return state;
    }

    const newState = {...state};
    newState.rss = {...state.rss};
    newState.rss.displayedArticles = [...newState.rss.displayedArticles];
    const indexToRemove = newState.rss.displayedArticles.indexOf(article);
    newState.rss.displayedArticles.splice(indexToRemove, 1);

    return newState;
}

function updateArticle(state: State, article: Article, patch) {
    const newState = {...state};
    newState.rss = {...newState.rss};

    newState.rss.displayedArticles = updateArticleInArray(
        article, newState.rss.displayedArticles, patch,
    );

    return newState;
}

function updateArticleInArray(article: Article, array: Article[], patch): Article[] {
    if (!array.includes(article)) {
        return array;
    }

    const newArray = [...array];
    const indexUpdatedArticle = newArray.indexOf(article);
    newArray[indexUpdatedArticle] = {
        ...newArray[indexUpdatedArticle],
        ...patch,
    };
    return newArray;
}

export function markedAsUnread(state: State, article: Article) {
    fetchCounters(state);
    return updateArticle(state, article, { isRead: false });
}

export function markedAsFavorite(state: State, article: Article) {
    return updateArticle(state, article, { isFavorite: true });
}

export function unmarkedAsFavorite(state: State, article: Article) {
    return updateArticle(state, article, { isFavorite: false });
}

export function openArticle(state: State, article: Article) {
    const tab = window.open(article.link, '_blank');
    if (tab) {
        tab.focus();
    }

    return state;
}

export function getBackend(selectedBackend: SelectableBackend): Backend {
    switch (selectedBackend) {
        case SelectableBackend.ttrss:
            return Container.instance.get(TTRss) as Backend;
        case SelectableBackend.test:
            return Container.instance.get(TestBackend) as Backend;
        default:
            logger.error('An unsupported backend was requested, return the default test backend');
            return Container.instance.get(TestBackend) as Backend;
    }
}

// This must be exported because to tests some component that uses dispatchify,
// these actions must be registered.
export function registerRssBackendsActions(store: Store<State>) {
    store.registerAction(
        selectBackend.name,
        selectBackend,
    );
    store.registerAction(
        authenticateSucceeded.name,
        authenticateSucceeded,
    );
    store.registerAction(
        isLoggedIn.name,
        isLoggedIn,
    );
    store.registerAction(
        markAsRead.name,
        markAsRead,
    );
    store.registerAction(
        markAsUnread.name,
        markAsUnread,
    );
    store.registerAction(
        markedAsRead.name,
        markedAsRead,
    );
    store.registerAction(
        markAsFavorite.name,
        markAsFavorite,
    );
    store.registerAction(
        unmarkAsFavorite.name,
        unmarkAsFavorite,
    );
    store.registerAction(
        markedAsUnread.name,
        markedAsUnread,
    );
    store.registerAction(
        markedAsFavorite.name,
        markedAsFavorite,
    );
    store.registerAction(
        unmarkedAsFavorite.name,
        unmarkedAsFavorite,
    );
    store.registerAction(
        openArticle.name,
        openArticle,
    );
    store.registerAction(
        fetchArticles.name,
        fetchArticles,
    );
    store.registerAction(
        receivedArticles.name,
        receivedArticles,
    );
    store.registerAction(
        fetchCategories.name,
        fetchCategories,
    );
    store.registerAction(
        receivedCategories.name,
        receivedCategories,
    );
    store.registerAction(
        fetchCounters.name,
        fetchCounters,
    );
    store.registerAction(
        receivedCounters.name,
        receivedCounters,
    );
}
