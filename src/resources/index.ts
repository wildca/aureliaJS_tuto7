import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
    config.globalResources([
        PLATFORM.moduleName('./attributes/aurss-mark-as-read-on-scroll'),
        PLATFORM.moduleName('./attributes/aurss-swipable'),
        PLATFORM.moduleName('./elements/aurss-article'),
        PLATFORM.moduleName('./elements/aurss-category-links'),
    ]);
}
