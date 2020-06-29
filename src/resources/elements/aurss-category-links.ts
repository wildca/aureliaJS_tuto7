import {bindable} from 'aurelia-framework';

export class AurssCategoryLinks {
    @bindable() public categories;
    @bindable() public currentCategoryId;
    @bindable() public onActiveClicked = (_categoryId: string) => {};

    public dispatchOnActiveClicked(event, clickedCategoryId): boolean {
        if (this.currentCategoryId !== clickedCategoryId) {
            // Do default action for event, don't prevent it.
            return true;
        }

        event.stopPropagation();
        this.onActiveClicked(clickedCategoryId);
        return false;
    }
}
