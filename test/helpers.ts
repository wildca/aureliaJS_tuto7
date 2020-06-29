import {Aurelia, PLATFORM} from 'aurelia-framework';
import {Backend} from 'aurelia-i18n';

export const prepareI18nComponent = (component) => {
    component.bootstrap((aurelia: Aurelia) => {
        return aurelia.use.standardConfiguration()
            .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
                const aliases = ['t', 'i18n'];

                // register backend plugin
                instance.i18next.use(Backend.with(aurelia.loader));
                const config = {
                    resources: {
                        en: {
                            translation: {
                                hello: undefined,
                            },
                        },
                    },
                    skipTranslationOnMissingKey: true,
                };

                return instance.setup(Object.assign({
                    attributes: aliases,
                    backend: {
                        loadPath: './locales/{{lng}}/{{ns}}.json',
                    },
                    debug: false,
                    defaultNS: 'translation',
                    fallbackLng: 'en',
                    interpolation: {
                        prefix: '{{',
                        suffix: '}}',
                    },
                    lng: 'en',
                }, config));
            });
    });
};

export const selectElementWithText = (document, selector, text): HTMLElement => {
    const nodeList: HTMLElement[] = Array.from(document.querySelectorAll(selector));
    // @ts-ignore: for TS element can be null.
    return nodeList.filter((element) => element.textContent.trim() === text)[0];
};
