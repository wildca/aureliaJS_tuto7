import {IDBPDatabase, openDB} from 'idb';
import * as constants from '../constants';

const DEFAULT_STORE_NAME = 'aurss-default-store';

export async function makeStorage(storeName: string = DEFAULT_STORE_NAME) {
    const db = await openDB(constants.DYNAMIC_DB_NAME, constants.DYNAMIC_DB_SCHEMA_VERSION, {
        upgrade: (database: IDBPDatabase) => {
            database.createObjectStore(storeName, { autoIncrement: true, keyPath: 'id' });
        },
    });

    return Object.freeze({
        async write(data) {
            await db.add(storeName, data);
        },
    });
}
