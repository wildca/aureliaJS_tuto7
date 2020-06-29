import * as idb from 'idb';
import {FetchMock} from 'jest-fetch-mock';
import {sync} from '../../../src/utils/sync';

/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('idb');

describe('sync', () => {
    const url = 'https://example.com';
    const payload = { body: '{"key": "value"}' };
    const dbName = 'test-db-name';

    beforeEach(() => {
        (fetch as FetchMock).mockResponse(JSON.stringify({keyResp: 'valueResp'}));
    });

    describe('sync with browser', () => {
        it('should sync with browser if SW is not available', async() => {
            expect('serviceWorker' in navigator).toBe(false);

            await sync(url, payload, dbName);

            expect(fetch).toHaveBeenCalledWith(url, payload);
        });

        it('should sync with browser if SyncManager is not in window', async() => {
            (global as any).navigator.serviceWorker = {};

            expect('serviceWorker' in navigator).toBe(true);
            expect('SyncManager' in window).toBe(false);

            await sync(url, payload, dbName);

            expect(fetch).toHaveBeenCalledWith(url, payload);
        });

        it('should resolve if browserSendSuccess returns true', async() => {
            try {
                await sync(url, payload, dbName, {browserSendSuccess: (data: any) => data.keyResp === 'valueResp'});
            } catch (e) {
                fail('Should not have thrown an error.');
            }
        });

        it('should reject if browserSendSuccess returns false', async() => {
            try {
                await sync(url, payload, dbName, {browserSendSuccess: (data: any) => data.keyResp !== 'valueResp'});
                fail('Should have thrown an error.');
            } catch (e) {
                // All is fine.
            }
        });
    });

    describe('Sync with SW', () => {
        let mockedDb;
        let sw;

        beforeEach(() => {
            sw = {
                sync: {
                    register: jest.fn(),
                },
            };
            (navigator as any).serviceWorker = {
                ready: Promise.resolve(sw),
            };
            (global as any).window.SyncManager = {};

            mockedDb = {
                add: jest.fn(),
            };
            (idb.openDB as jest.Mock).mockReturnValue(mockedDb);
        });

        // This is to tests setup is correctly done in beforeEach.
        it('SW and SyncManager must be defined', () => {
            expect('serviceWorker' in navigator).toBe(true);
            expect('SyncManager' in window).toBe(true);
        });

        it('should register sync action', async() => {
            await sync(url, payload, dbName);

            expect(sw.sync.register).toHaveBeenCalledWith(dbName);
        });

        it('should write data to storage', async() => {
            await sync(url, payload, dbName);

            expect(mockedDb.add).toHaveBeenCalledWith(dbName, {
                payload,
                url,
            });
        });
    });
});
