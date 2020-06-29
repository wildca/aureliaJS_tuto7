import {Article} from '../../src/models/Article';

export const createArticle = (): Article => {
    return {
        author: 'Me',
        feedId: 0,
        feedTitle: 'Test feed',
        id: 0,
        isFavorite: false,
        isRead: false,
        link: 'https://example.com/article/0',
        title: 'Test article',
        updatedAt: new Date('2019-06-10 13:00:00'),
    };
};

export const createUnreadArticle = (): Article => {
    return {
        author: 'Me',
        feedId: 0,
        feedTitle: 'Test feed',
        id: 0,
        isFavorite: false,
        isRead: false,
        link: 'https://example.com/article/0',
        title: 'Test article',
        updatedAt: new Date('2019-06-10 13:00:00'),
    };
};

export const createReadArticle = (): Article => {
    return {
        author: 'Me',
        feedId: 0,
        feedTitle: 'Test feed',
        id: 0,
        isFavorite: false,
        isRead: true,
        link: 'https://example.com/article/0',
        title: 'Test article',
        updatedAt: new Date('2019-06-10 13:00:00'),
    };
};
