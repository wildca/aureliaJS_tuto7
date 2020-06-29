import {autoinject} from 'aurelia-framework';
import {I18N} from 'aurelia-i18n';
import * as LogManager from 'aurelia-logging';
import { Store } from 'aurelia-store';
import * as constants from '../../constants';
import {Article} from '../../models/Article';
import {Category} from '../../models/Category';
import {Counter} from '../../models/Counter';
import * as actions from '../../store/rss-backends-actions';
import { Auth, State } from '../../store/state';
import {sync} from '../../utils/sync';
import { Backend } from '../backend';

enum TTRssFeedIds {
    all = -4,
    archived = 0,
    labels = -2,
    published = -2,
    stared = -1,
    unread = -3,
}

enum TTRssArticleUpdateMode {
    setToFalse = 0,
    setToTrue = 1,
    toggle = 2,
}

enum TTRssUpdatableFields {
    starred = 0,
    published = 1,
    unread = 2,
    note = 3,
}

/**
 * Backend implementation for TTRSS.
 *
 * API reference: https://git.tt-rss.org/fox/tt-rss/wiki/ApiReference
 */
@autoinject()
export class TTRss implements Backend {
    private API_PATH = '/api/';
    private authenticationInfos: Auth;
    private parsedApiUrl: URL;
    private logger;

    public constructor(private i18n: I18N, private store: Store<State>) {
        this.logger = LogManager.getLogger('aurss:backend:ttrss');
        this.store.state.subscribe(
            (state) => this.authenticationInfos = state.authentication,
        );
    }

    public authenticate(host: string, username: string, password: string): Promise<string> {
        this.buildApiUrl(host);

        return this.queryApi({ password, op: 'login', user: username })
            .then((data) => data.session_id)
            .then((token) => {
                if (!token) {
                    this.logger.error('Authentication failed');
                    return Promise.reject();
                }

                this.store.dispatch(actions.authenticateSucceeded, {
                    host,
                    password,
                    token,
                    username,
                    isLoggedIn: true,
                });

                return Promise.resolve(token);
            });
    }

    public getArticles(categoryId: string): Promise<Article[]> {
        let id;
        if (categoryId === constants.DEFAULT_CATEGORY) {
            id = TTRssFeedIds.unread;
        } else {
            id = parseInt(categoryId, 10);
        }
        if (!Number.isInteger(id)) {
            return Promise.reject(new Error(`${categoryId} is not supported by TTRSS backend`));
        }

        return this.getArticlesFromFeedOrCategory(id)
            .then((articles: Article[]) => {
                this.store.dispatch(actions.receivedArticles, articles);
                return articles;
            });
    }

    private getArticlesFromFeedOrCategory(id: number) {
        return this.queryApi({
            // eslint-disable-next-line @typescript-eslint/camelcase
            feed_id: id,
            // Categories have an id bigger than 0. Ids lower than 0 are for special feeds.
            // eslint-disable-next-line @typescript-eslint/camelcase
            is_cat: id >= 0,
            op: 'getHeadlines',
            sid: this.authenticationInfos.token,
        })
            .then((data) => data.map((rawArticle): Article => ({
                author: rawArticle.author,
                feedId: rawArticle.feed_id,
                feedTitle: rawArticle.feed_title,
                id: rawArticle.id,
                isFavorite: rawArticle.marked,
                isRead: !rawArticle.unread,
                link: rawArticle.link,
                title: rawArticle.title,
                updatedAt: new Date(rawArticle.updated * 1000),
            })));
    }

    private queryApi(payload): Promise<any> {
        return fetch(this.apiUrl, {
            body: JSON.stringify(payload),
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => data.content);
    }

    public getCategories(): Promise<Category[]> {
        const getCategories = this.queryApi({
            op: 'getCategories',
            sid: this.authenticationInfos.token,
        });

        const unreadCountsByCategoryId = {};
        const getUnreadCounts = this.getCounters()
            .then((counts) => counts.reduce(
                (countsByCategoryId, countData) => {
                    countsByCategoryId[countData.categoryId] = countData.unreadCount;
                    return countsByCategoryId;
                }, unreadCountsByCategoryId));

        return Promise.all([getCategories, getUnreadCounts])
            .then(([categoryData, countData]) => categoryData.map((rawCategory): Category => ({
                id: rawCategory.id.toString(),
                title: rawCategory.title,
                unreadCount: countData[rawCategory.id] || 0,
            })))
            // Categories with ids < 0 are special categories and we handle them manually.
            // So we exclude them from the list of categories here.
            .then((categories) => categories.filter((category) => category.id >= 0))
            .then((categories) => {
                const specialCategories: Category[] = [{
                    id: TTRssFeedIds.all.toString(),
                    title: this.i18n.tr('display-articles-from-category-title-all'),
                    unreadCount: unreadCountsByCategoryId['global-unread'] || 0,
                }, {
                    id: TTRssFeedIds.unread.toString(),
                    title: this.i18n.tr('display-articles-from-category-title-unread'),
                    unreadCount: unreadCountsByCategoryId[TTRssFeedIds.unread] || 0,
                }, {
                    id: TTRssFeedIds.stared.toString(),
                    title: this.i18n.tr('display-articles-from-category-title-favorites'),
                    unreadCount: unreadCountsByCategoryId[TTRssFeedIds.stared] || 0,
                }];

                return specialCategories.concat(categories);
            })
            .then((categories) => {
                this.store.dispatch(actions.receivedCategories, categories);
                return categories;
            });
    }

    public getCounters(): Promise<Counter[]> {
        return this.queryApi({
            op: 'getCounters',
            sid: this.authenticationInfos.token,
        })
            .then((counts) => counts
                // We can't match this count to anything, skip it.
                .filter((counterData) => counterData.id)
                .map((counterData): Counter => ({
                    categoryId: counterData.id.toString(),
                    unreadCount: counterData.counter,
                })))
            .then((counters) => {
                this.store.dispatch(actions.receivedCounters, counters);
                return counters;
            });
    }

    public isLoggedIn({ allowAutoLogin = true } = {}): Promise<boolean> {
        if (!this.authenticationInfos.token && allowAutoLogin) {
            this.logger.debug('No token but we can try autologging');
            return this.tryAutologging();
        } else if (!this.authenticationInfos.token) {
            this.logger.debug('No token and no autologging, we are not authenticated');
            return Promise.resolve(false);
        } else if (!this.authenticationInfos.host) {
            this.logger.debug('API host is unknown, we cannot do anything.');
            return Promise.resolve(false);
        }

        this.logger.debug('Checking token validity');
        return this.queryApi({
            op: 'isLoggedIn',
            sid: this.authenticationInfos.token,
        })
            .then((data) => data.status)
            .then((isLoggedIn) => {
                if (isLoggedIn) {
                    this.logger.debug('We are logged in');
                    this.store.dispatch(actions.isLoggedIn);
                    return isLoggedIn;
                } else if (allowAutoLogin) {
                    this.logger.debug('Token is not valid, attempting to auto log');
                    return this.tryAutologging();
                }

                this.logger.debug('Authentication failed');
                return false;
            });
    }

    public markAsRead(article: Article): Promise<void> {
        return this.updateArticle(
            article, TTRssUpdatableFields.unread, TTRssArticleUpdateMode.setToFalse,
        ).then(() => this.store.dispatch(actions.markedAsRead, article));
    }

    public markAsUnread(article: Article): Promise<void> {
        return this.updateArticle(
            article, TTRssUpdatableFields.unread, TTRssArticleUpdateMode.setToTrue,
        ).then(() => this.store.dispatch(actions.markedAsUnread, article));
    }

    public markAsFavorite(article: Article): Promise<void> {
        return this.updateArticle(
            article, TTRssUpdatableFields.starred, TTRssArticleUpdateMode.setToTrue,
        ).then(() => this.store.dispatch(actions.markedAsFavorite, article));
    }

    public unmarkAsFavorite(article: Article): Promise<void> {
        return this.updateArticle(
            article, TTRssUpdatableFields.starred, TTRssArticleUpdateMode.setToFalse,
        ).then(() => this.store.dispatch(actions.unmarkedAsFavorite, article));
    }

    private tryAutologging(): Promise<boolean> {
        this.logger.debug('Trying to auto log');
        return this.authenticate(
            this.authenticationInfos.host,
            this.authenticationInfos.username,
            this.authenticationInfos.password,
        ).then(() => {
            // If authentication succeeds, the chain will be resolved.
            this.logger.debug('Auto log succeeded');
            return true;
        }, () => {
            // If authentication failed, the chain will be rejected.
            this.logger.debug('Auto log failed');
            return false;
        });
    }

    private buildApiUrl(apiHost: string = '') {
        const host = apiHost || this.authenticationInfos.host;
        this.logger.debug('API URL is set to', host);
        this.parsedApiUrl = new URL(this.API_PATH, host);
    }

    private updateArticle(
        article: Article, field: TTRssUpdatableFields, mode: TTRssArticleUpdateMode,
    ) {
        return sync(
            this.apiUrl,
            {
                body: JSON.stringify({
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    article_ids: article.id.toString(),
                    field,
                    mode,
                    op: 'updateArticle',
                    sid: this.authenticationInfos.token,
                }),
                method: 'POST',
            },
            constants.TTRSS_ACTIONS_STORAGE_NAME,
            { browserSendSuccess: (data: {content: {status: string}}) => data.content.status === 'OK' },
        ).then(null, () => {
            this.logger.error('Failed to update article.');
            return Promise.reject();
        });
    }

    private get apiUrl() {
        if (!this.parsedApiUrl) {
            this.buildApiUrl();
        }

        return this.parsedApiUrl.href;
    }
}
