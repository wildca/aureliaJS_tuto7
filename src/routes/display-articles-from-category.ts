import {autoinject} from 'aurelia-framework';
import {Store, dispatchify} from 'aurelia-store';
import {Subscription} from 'rxjs';
import {pluck} from 'rxjs/operators';
import * as constants from '../constants';
import {Article} from '../models/Article';
import * as rssActions from '../store/rss-backends-actions';
import {State} from '../store/state';

@autoinject()
export class DisplayArticlesFromCategory {
    public articles: Article[] = [];
    public isFetching: boolean = false;
    public title: string = '';
    public markArticleAsRead = dispatchify(rssActions.markAsRead);
    public markArticleAsReadAndDiscard: (article: Article) => void;
    public markArticleAsUnread = dispatchify(rssActions.markAsUnread);
    public markArticleAsFavorite = dispatchify(rssActions.markAsFavorite);
    public unmarkArticleAsFavorite = dispatchify(rssActions.unmarkAsFavorite);
    public openArticle: (article: Article) => void;
    private subscription: Subscription;

    public constructor(private store: Store<State>) {
        this.openArticle = (article) => this.store
            .pipe(rssActions.openArticle, article)
            .pipe(rssActions.markAsRead, article)
            .dispatch();
        this.markArticleAsReadAndDiscard = (article) => {
            return this.markArticleAsRead(article, { discard: true });
        };
    }

    public activate({ categoryId = constants.DEFAULT_CATEGORY } = {}) {
        this.store.dispatch(rssActions.fetchArticles, categoryId);
        this.subscription = this.store.state.pipe(pluck('rss'))
            .subscribe((rssData) => {
                this.articles = rssData.displayedArticles;
                this.isFetching = rssData.isFetching;
                const categories = rssData.categories
                    .filter((category) => category.id.toString() === categoryId);
                if (categories.length > 0) {
                    this.title = categories[0].title;
                }
            });
    }

    public deactivate() {
        this.subscription.unsubscribe();
    }
}
