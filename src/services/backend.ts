import {Article} from '../models/Article';
import {Category} from '../models/Category';
import {Counter} from '../models/Counter';

export interface Backend {
    authenticate(host: string, username: string, password: string): Promise<string>;
    getArticles(categoryId: string): Promise<Article[]>;
    getCategories(): Promise<Category[]>;
    getCounters(): Promise<Counter[]>;
    /**
     * Returns true if the user is logged in. Returns false otherwise.
     *
     * @param allowAutoLogin If the session token is not valid any more and this is true,
     * we try to get a new token.
     */
    isLoggedIn({ allowAutoLogin }): Promise<boolean>;
    markAsRead(article: Article): Promise<void>;
    markAsUnread(article: Article): Promise<void>;
    markAsFavorite(article: Article): Promise<void>;
    unmarkAsFavorite(article: Article): Promise<void>;
}
