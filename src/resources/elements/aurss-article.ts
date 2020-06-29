import { bindable } from 'aurelia-framework';
import {Article} from '../../models/Article';
import '@fortawesome/fontawesome-free/css/all.css';
import './aurss-article.scss';

export class AurssArticleCustomElement {
    @bindable public value: Article;
    @bindable public markArticleAsRead: (article: Article) => void;
    @bindable public markArticleAsUnread: (article: Article) => void;
    @bindable public markArticleAsFavorite: (article: Article) => void;
    @bindable public unmarkArticleAsFavorite: (article: Article) => void;
    @bindable public openArticle: (article: Article) => void;

    public timeFormat = {
        day: '2-digit',
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };

    public markAsRead() {
        this.markArticleAsRead(this.value);
    }

    public markAsUnread() {
        this.markArticleAsUnread(this.value);
    }

    public markAsFavorite() {
        this.markArticleAsFavorite(this.value);
    }

    public unmarkAsFavorite() {
        this.unmarkArticleAsFavorite(this.value);
    }

    public open() {
        this.openArticle(this.value);
    }
}
