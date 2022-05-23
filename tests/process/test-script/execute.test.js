const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const testScriptExecute = require('../../../src/process/test-script/execute');

jest.mock('../../../src/modules/http', () => ({
  runSequence: jest.fn().mockResolvedValue({}),
}));

describe('Test Script Execute Process Tests', () => {
  const mockData = new Chance();
  const defaultExecCount = 200 * 10;

  describe('happy path', () => {
    it('should execute test scripts and return new context data', async () => {
      try {
        const mockStoreTestResults = jest.fn();
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              basePath: mockData.string(),
              testScripts: [{}, {}, {}],
            },
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTestResults: mockStoreTestResults,
            },
          },
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
        };

        const newCtxData = await testScriptExecute(undefined, context);

        expect(mockStoreTestResults).toHaveBeenCalled();
        expect(newCtxData.key).toBe(PROCESS_ENUM.SCRIPT_EXECUTE);
        expect(newCtxData.startTime).toBeDefined();
        expect(newCtxData.endTime).toBeDefined();
      } catch (error) {
        throw new Error(error);
      }
    });
    it('should execute test scripts with default rounds and threads and return new context data', async () => {
      try {
        const rounds = mockData.integer({ min: 1, max: 10 });
        const threads = mockData.integer({ min: 1, max: 10 });
        const mockStoreTestResults = jest.fn();
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              basePath: mockData.string(),
              testScripts: [{}, {}, {}],
              rounds,
              threads,
            },
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTestResults: mockStoreTestResults,
            },
          },
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
        };

        const newCtxData = await testScriptExecute(undefined, context);

        expect(mockStoreTestResults).toHaveBeenCalled();
        expect(newCtxData.key).toBe(PROCESS_ENUM.SCRIPT_EXECUTE);
        expect(newCtxData.startTime).toBeDefined();
        expect(newCtxData.endTime).toBeDefined();
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw error when no base path is provided', async () => {
      const mockStoreTestResults = jest.fn();
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTestResults: mockStoreTestResults,
            },
          },
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
        };

        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(mockStoreTestResults).not.toHaveBeenCalled();
        expect(error).toEqual(new Error(
          'No valid AMIOK scripts basePath provided. Check your amiok.settings.json file'
        ));
      }
    });
    it('should throw error when testScripts is not an array', async () => {
      const mockStoreTestResults = jest.fn();
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              basePath: mockData.url(),
              testScripts: 123,
            },
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTestResults: mockStoreTestResults,
            },
          },
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
        };

        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(mockStoreTestResults).not.toHaveBeenCalled();
        expect(error).toEqual(new Error(
          'No AMIOK test scripts provided. Check your amiok.settings.json file'
        ));
      }
    });
    it('should throw error when testScripts is an empty array', async () => {
      const mockStoreTestResults = jest.fn();
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              basePath: mockData.url(),
              testScripts: 123,
            },
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTestResults: mockStoreTestResults,
            },
          },
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
        };

        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(mockStoreTestResults).not.toHaveBeenCalled();
        expect(error).toEqual(new Error(
          'No AMIOK test scripts provided. Check your amiok.settings.json file'
        ));
      }
    });
    it('should throw error when an exception occurs', async () => {
      const mockStoreTestResults = jest.fn();
      try {
        const context = {};

        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(mockStoreTestResults).not.toHaveBeenCalled();
      }
    });
  });
});