import {autoinject} from 'aurelia-framework';
import {dispatchify} from 'aurelia-store';
import {Article} from '../../models/Article';
import {Category} from '../../models/Category';
import {Counter} from '../../models/Counter';
import * as actions from '../../store/rss-backends-actions';
import {Backend} from '../backend';

const FAKE_TOKEN = 'FAKE_TOKEN';
const createId = getIdCreator();

@autoinject()
export class TestBackend implements Backend {
    private favoriteArticles: Article[] = [{
        author: 'Favorite author',
        feedId: 0,
        feedTitle: 'Test feed',
        id: createId(),
        isRead: false,
        isFavorite: true,
        link: 'https://example.com',
        title: 'My favorite article',
        updatedAt: new Date(),
    }];
    private freshArticles: Article[] = [{
        author: 'Fresh author',
        feedId: 1,
        feedTitle: 'Test feed 2',
        id: createId(),
        isRead: false,
        isFavorite: false,
        link: 'https://example.com',
        title: 'Fresh article',
        updatedAt: new Date(),
    }];

    public constructor() {
    }

    public authenticate(): Promise<string> {
        return Promise.resolve(FAKE_TOKEN);
    }

    public getArticles(): Promise<Article[]> {
        return Promise.resolve(this.freshArticles);
    }

    public getCategories(): Promise<Category[]> {
        return Promise.resolve([]);
    }

    public getCounters(): Promise<Counter[]> {
        return Promise.resolve([]);
    }

    public isLoggedIn(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public markAsFavorite(article: Article): Promise<void> {
        const newArticle = {
            ...article,
            isFavorite: true,
        };
        this.favoriteArticles.push(newArticle);
        return dispatchify(actions.markedAsFavorite)(article);
    }

    public markAsRead(article: Article): Promise<void> {
        return dispatchify(actions.markedAsRead)(article);
    }

    public markAsUnread(article: Article): Promise<void> {
        return dispatchify(actions.markedAsUnread)(article);
    }

    public unmarkAsFavorite(article: Article): Promise<void> {
        const index = this.favoriteArticles
            .map(favoriteArticle => favoriteArticle.id)
            .indexOf(article.id);
        if (index > -1) {
            this.favoriteArticles.splice(index, 1);
        }
        return dispatchify(actions.unmarkedAsFavorite)(article);
    }
}

function getIdCreator() {
    let id = 0;
    function _createId() {
        id++;
        return id;
    }
    return _createId;
}
