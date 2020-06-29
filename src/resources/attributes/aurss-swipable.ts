import {autoinject, bindable} from 'aurelia-framework';

@autoinject()
export class AurssSwipableCustomAttribute {
    @bindable() private onSwipeSuccess;
    @bindable() private onSwipeSuccessArg;
    private htmlElement: HTMLElement;
    private elementChild: HTMLElement;
    private currentLeftOffset: number;
    private elementWidth: number;
    private previousPageX: number;
    private readonly originalLeftPosition;
    private readonly touchendEventListener;
    private readonly touchmoveEventListener;

    public constructor(private element: Element) {
        this.htmlElement = (this.element as HTMLElement);
        this.elementChild = (this.element.firstElementChild as HTMLElement);
        this.originalLeftPosition = this.elementChild.style.left || 0;
        this.previousPageX = 0;
        this.currentLeftOffset = 0;
        this.touchmoveEventListener = (event) => {
            const touch = event.changedTouches[0];
            if (this.previousPageX !== 0) {
                this.currentLeftOffset += (touch.pageX - this.previousPageX);
                this.elementChild.style.left = `${this.currentLeftOffset}px`;
            }

            this.previousPageX = touch.pageX;
        };
        this.touchendEventListener = () => {
            if (Math.abs(this.currentLeftOffset) > 0.5 * this.elementWidth) {
                this.onSwipeSuccess(this.onSwipeSuccessArg);
            } else {
                this.elementChild.style.left = this.originalLeftPosition;
                this.previousPageX = 0;
                this.currentLeftOffset = 0;
            }
        };
    }

    public attached() {
        this.htmlElement.style.position = 'relative';
        this.elementChild.style.position = 'relative';
        // This cannot be computed in the constructor since the element is not in the DOM yet.
        // We therefore cannot get its actual width.
        this.elementWidth = this.elementChild.getBoundingClientRect().width;
        this.elementChild.addEventListener('touchmove', this.touchmoveEventListener);
        this.elementChild.addEventListener('touchend', this.touchendEventListener);
    }

    public detached() {
        this.elementChild.removeEventListener('swipe', this.touchmoveEventListener);
        this.elementChild.removeEventListener('touchend', this.touchendEventListener);
    }
}
