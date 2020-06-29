import * as idb from 'idb';
import { makeStorage } from '../../../src/utils/dynamic-data-storage';

jest.mock('idb');

describe('dynamic-data-storage-spec', () => {
    let mockedDb;
    let sut;
    const storageName = 'test';

    beforeEach(async() => {
        mockedDb = {
            add: jest.fn(),
        };
        (idb.openDB as jest.Mock).mockReturnValue(mockedDb);

        sut = await makeStorage(storageName);
    });

    it('should auto-connect to db', () => {
        // We specified the name of the store, but the name on the db will always be the same.
        expect(idb.openDB).toHaveBeenCalledWith('aurss', 1, { upgrade: expect.any(Function) });
    });

    it('should write data', async() => {
        await sut.write({ key: 'value' });

        expect(mockedDb.add).toHaveBeenCalledWith(storageName, { key: 'value' });
    });
});
