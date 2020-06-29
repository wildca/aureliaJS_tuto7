import * as LogManager from 'aurelia-logging';
import {makeStorage} from './dynamic-data-storage';

const utilsLogger = LogManager.getLogger('aurss:utils');

export function sync(
    url: string,
    payload: object,
    dbName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { browserSendSuccess = (_data: object) => true } = {},
) {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        utilsLogger.info('Relying on SW to sync');
        return swSend(url, payload, dbName);
    }

    utilsLogger.info('SW or SyncManager not supported, relying on browser send');
    return browserSend(url, payload, browserSendSuccess);
}

async function swSend(url, payload, dbName) {
    const sw = await navigator.serviceWorker.ready;
    const storage = await makeStorage(dbName);
    await storage.write({
        payload,
        url,
    });
    await sw.sync.register(dbName);
}

async function browserSend(url, payload, browserSendSuccess) {
    return await fetch(url, payload)
        .then((response) => response.json())
        .then((data) => browserSendSuccess(data))
        .then((success) => success ? Promise.resolve() : Promise.reject());
}
