import { bootstrap } from 'aurelia-bootstrapper';
import {PLATFORM} from 'aurelia-pal';
import { StageComponent } from 'aurelia-testing';
import {createArticle, createReadArticle} from '../../__fixtures__/articles-fixtures';
import {prepareI18nComponent, selectElementWithText} from '../../helpers';

describe('aurss-article', () => {
    let component;
    let viewModel;

    beforeEach(async(done) => {
        viewModel = {
            article: createArticle(),
            markArticleAsRead: jest.fn(),
            markArticleAsUnread: jest.fn(),
            openArticle: jest.fn(),
        };

        component = StageComponent.withResources(PLATFORM.moduleName('../../src/resources/elements/aurss-article'))
            .inView(`
            <aurss-article
                value.bind="article"
                mark-article-as-read.bind="markArticleAsRead"
                mark-article-as-unread.bind="markArticleAsUnread"
                open-article.bind="openArticle"
            ></aurss-article>
            `).boundTo(viewModel);

        prepareI18nComponent(component);

        await component.create(bootstrap);

        done();
    });

    afterEach(() => {
        component.dispose();
    });

    it('should render and match snapshot', () => {
        expect(document.body.outerHTML).toMatchSnapshot();
    });

    it('should call mark as read when mark as read button is clicked', () => {
        const markAsReadButton = selectElementWithText(document, 'button', 'Mark as read');

        markAsReadButton.click();

        expect(viewModel.markArticleAsRead).toHaveBeenCalledWith(viewModel.article);
    });

    it('should call mark as unread when mark as unread button is clicked', async() => {
        // We must mark as read first so the button is in the view model
        // and wait for the change to be applied.
        viewModel.article = createReadArticle();
        await component.waitForElement('.read', { present: true, timeout: 500 });
        const markAsUnreadButton = selectElementWithText(document, 'button', 'Mark as unread');

        markAsUnreadButton.click();

        expect(viewModel.markArticleAsUnread).toHaveBeenCalledWith(viewModel.article);
    });

    it('should open when the open button is clicked', () => {
        const openButton = selectElementWithText(document, 'button', 'Open');
        const focus = jest.fn();
        window.open = jest.fn().mockReturnValue({ focus });

        openButton.click();

        expect(viewModel.openArticle).toHaveBeenCalledWith(viewModel.article);
    });
});
