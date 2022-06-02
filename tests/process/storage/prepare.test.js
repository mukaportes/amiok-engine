const PROCESS_ENUM = require('../../../src/enums/process');
const storagePrepare = require('../../../src/process/storage/prepare');
const defaultStorageModule = require('../../../src/modules/store');
const customStorageModule = require('../../mocks/amiok.storage');

jest.mock('fs/promises', () => ({
  access: jest.fn((path) => new Promise((resolve, reject) => {
    if (path.includes('/path/error')) {
      reject();
    } else {
      resolve();
    }
  })),
}));

describe('Storage Prepare Process Tests', () => {
  describe('happy path', () => {
    it('should return new context data with default storage config', async () => {
      const stubCwd = jest.spyOn(process, 'cwd').mockImplementation(() => '../../../tests/mocks/');
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              storageModule: 'amiok.storage.js',
            },
          },
        };

        const newCtxData = await storagePrepare(undefined, context);

        expect(stubCwd).toHaveBeenCalled();
        expect(newCtxData).toStrictEqual({
          key: PROCESS_ENUM.STORAGE_PREPARE,
          storage: customStorageModule,
        });
      } catch (error) {

      }
    });
    it('should return new context data with custom storage config when no storageModule path is defined', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
        };
        const newCtxData = await storagePrepare(undefined, context);

        expect(newCtxData).toStrictEqual({
          key: PROCESS_ENUM.STORAGE_PREPARE,
          storage: defaultStorageModule,
        });
      } catch (error) {
        throw new Error(error);
      }
    });
    it('should return new context data with custom storage config when storageModule path is invalid', async () => {
      const stubCwd = jest.spyOn(process, 'cwd').mockImplementation(() => '/path/error');
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              storageModule: 'error.js',
            },
          },
        };
        const newCtxData = await storagePrepare(undefined, context);

        expect(stubCwd).toHaveBeenCalled();
        expect(newCtxData).toStrictEqual({
          key: PROCESS_ENUM.STORAGE_PREPARE,
          storage: defaultStorageModule,
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw an error when SETTINGS_PREPARE context data is missing', async () => {
      try {
        await storagePrepare();
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETTINGS_PREPARE context data'));
      }
    });
    it('should throw an error when SETTINGS_PREPARE config is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {},
        };
        await storagePrepare(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing settings config'));
      }
    });
  });
});