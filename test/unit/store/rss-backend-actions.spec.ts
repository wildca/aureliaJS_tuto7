import {Container} from 'aurelia-framework';
import {Backend} from '../../../src/services/backend';
import {TestBackend} from '../../../src/services/backends/test';
import {
    authenticateSucceeded,
    fetchArticles,
    markAsRead,
    markAsUnread, markedAsRead, markedAsUnread,
    receivedArticles,
} from '../../../src/store/rss-backends-actions';
import {State} from '../../../src/store/state';
import {createArticle, createReadArticle, createUnreadArticle} from '../../__fixtures__/articles-fixtures';
import {createAuthInfos, createInitialState} from '../../__fixtures__/state-fixtures';

describe('rss-backend-actions', () => {
    const dummyCategory = 'dummy-cat';
    let state: State;
    let rssBackend: Backend;

    beforeEach(() => {
        state = createInitialState();

        rssBackend = Container.instance.get(TestBackend);
    });

    describe('Actions that mutate the state but do not rely on the backend', () => {
        it('authenticateSucceeded should store authentication infos in the state and to navigate to the home', () => {
            const newState = authenticateSucceeded(state, createAuthInfos());

            // Check original state not mutated.
            expect(state.authentication).toMatchSnapshot();
            expect(newState).toMatchSnapshot();
        });

        it('markedAsRead', () => {
            const article = createUnreadArticle();
            state.rss.displayedArticles.push(article);

            const newState = markedAsRead(state, article);

            // Check original not mutated.
            expect(article.isRead).toBe(false);
            expect(newState.rss.displayedArticles[0]).not.toBe(article);
            // Check state is correct.
            expect(newState.rss.displayedArticles[0].isRead).toBe(true);
        });

        it('markAsRead and discard', () => {
            const article = createUnreadArticle();
            state.rss.displayedArticles.push(article);
            state.rss.articlesToDiscards.push(article);

            const newState = markedAsRead(state, article);

            // Check original not mutated.
            expect(newState.rss.displayedArticles[0]).not.toBe(article);
            // Check state is correct.
            expect(newState.rss.displayedArticles.length).toBe(0);
        });

        it('markedAsUnread', () => {
            const article = createReadArticle();
            state.rss.displayedArticles.push(article);

            const newState = markedAsUnread(state, article);

            // Check original not mutated.
            expect(article.isRead).toBe(true);
            expect(newState.rss.displayedArticles[0]).not.toBe(article);
            // Check state is correct.
            expect(newState.rss.displayedArticles[0].isRead).toBe(false);
        });

        it('receivedArticles', () => {
            const article = createArticle();

            const newState = receivedArticles(state, [article]);

            // Check original state not mutated.
            expect(state.rss.displayedArticles.length).toBe(0);
            expect(newState.rss.displayedArticles.length).toBe(1);
            expect(newState.rss.displayedArticles[0]).toBe(article);
        });
    });

    describe('Actions that rely on the RSS backend but do not change the state', () => {
        let article;

        beforeEach(() => {
            article = createArticle();
        });

        it('fetchArticles', () => {
            spyOn(rssBackend, 'getArticles');

            fetchArticles(state, dummyCategory);

            expect(rssBackend.getArticles).toHaveBeenCalledWith(dummyCategory);
        });

        it('markAsRead', () => {
            spyOn(rssBackend, 'markAsRead');

            markAsRead(state, article);

            expect(rssBackend.markAsRead).toHaveBeenCalledWith(article);
        });

        it('markAsUnread', () => {
            spyOn(rssBackend, 'markAsUnread');

            markAsUnread(state, article);

            expect(rssBackend.markAsUnread).toHaveBeenCalledWith(article);
        });
    });
});
