import {Container} from 'aurelia-framework';
import {Options} from 'aurelia-loader-nodejs';
import {globalize} from 'aurelia-pal-nodejs';
import 'aurelia-polyfills';
import * as IntlPolyfill from 'intl';
import {GlobalWithFetchMock} from 'jest-fetch-mock';
import * as path from 'path';

/* eslint-disable @typescript-eslint/no-explicit-any */

Options.relativeToDir = path.join(__dirname, 'unit');
globalize();

(global as any).navigator = {};

global.Intl.NumberFormat   = IntlPolyfill.NumberFormat;
global.Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
(window as any).Intl = global.Intl;

(window as any).Intl.NumberFormat   = IntlPolyfill.NumberFormat;
(window as any).Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;

const container = new Container();
container.makeGlobal();
