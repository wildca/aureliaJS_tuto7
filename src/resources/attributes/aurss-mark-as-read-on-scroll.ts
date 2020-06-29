import {autoinject, bindable} from 'aurelia-framework';

@autoinject()
export class AurssMarkAsReadOnScrollCustomAttribute {
    @bindable() private markAsRead;
    @bindable() private article;
    private triggered: boolean;
    private readonly scrollEventListener;

    public constructor(private element: Element) {
        this.triggered = false;
        this.scrollEventListener = () => {
            // If the article is already read there is nothing to do.
            if (this.article.isRead) {
                return;
            } else if (this.triggered) {
                // If this was already triggered, there is nothing to do.
                return;
            }

            if (this.element.getBoundingClientRect().top < 0) {
                this.triggered = true;
                this.markAsRead(this.article);
            }
        };
    }

    public attached() {
        // We only do this on desktop. Swipe can be used on touch devices.
        if ('ontouchstart' in window) {
            return;
        }

        // @ts-ignore: TS cannot know that sometimes, ontouchstart is not in window.
        window.addEventListener('scroll', this.scrollEventListener);
    }

    public detached() {
        // We only do this on desktop. Swipe can be used on touch devices.
        if ('ontouchstart' in window) {
            return;
        }

        // @ts-ignore: TS cannot know that sometimes, ontouchstart is not in window.
        window.removeEventListener('scroll', this.scrollEventListener);
    }
}

