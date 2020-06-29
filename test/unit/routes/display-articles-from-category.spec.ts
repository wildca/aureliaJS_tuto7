import {bootstrap} from 'aurelia-bootstrapper';
import {Container} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';
import {Store} from 'aurelia-store';
import {StageComponent} from 'aurelia-testing';
import {Article} from '../../../src/models/Article';
import {receivedArticles, registerRssBackendsActions} from '../../../src/store/rss-backends-actions';
import {createInitialState} from '../../__fixtures__/state-fixtures';

describe('Route: DisplayArticlesFromCategory', () => {
    describe('Render tests', () => {
        let component;
        let store;
        let state;

        beforeEach(async() => {
            state = createInitialState();
            state.rss.isFetching = true;
            store = new Store(state);
            registerRssBackendsActions(store);
            Container.instance.registerInstance(Store, store);

            component = StageComponent.withResources(PLATFORM.moduleName('../../src/routes/display-articles-from-category'))
                .inView('<display-articles-from-category></display-articles-from-category>');

            await component.create(bootstrap);
            component.viewModel.store = store;
            component.viewModel.activate();

            return component;
        });

        afterEach(() => {
            component.dispose();
        });

        it('should render and match snapshot while fetching', async() => {
            await component.waitForElement('.fa-spinner');

            expect(document.body.outerHTML).toMatchSnapshot();
        });

        it('should render and match snapshot after fetching and no result', async() => {
            await store.dispatch(receivedArticles, []);
            await component.waitForElement('.articles-container');

            expect(document.body.outerHTML).toMatchSnapshot();
        });

        it('should render and match snapshot after fetching and results', async() => {
            const articles: Article[] = [{
                author: 'Tester',
                title: 'Test article',
                feedId: 0,
                feedTitle: 'Test feed',
                id: 1,
                isRead: false,
                isFavorite: false,
                updatedAt: new Date(),
                link: 'https://example.com',
            }];
            await store.dispatch(receivedArticles, articles);
            await component.waitForElements('aurss-article');

            expect(document.body.outerHTML).toMatchSnapshot();
        });
    });
});
