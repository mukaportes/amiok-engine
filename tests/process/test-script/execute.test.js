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
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: mockData.integer(),
            },
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
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: mockData.integer(),
            },
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
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: mockData.integer(),
            },
          },
        };

        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(mockStoreTestResults).not.toHaveBeenCalled();
        expect(error).toEqual(
          new Error('No valid AMIOK scripts basePath provided. Check your amiok.settings.json file')
        );
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
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: mockData.integer(),
            },
          },
        };

        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(mockStoreTestResults).not.toHaveBeenCalled();
        expect(error).toEqual(
          new Error('No AMIOK test scripts provided. Check your amiok.settings.json file')
        );
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
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: mockData.integer(),
            },
          },
        };

        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(mockStoreTestResults).not.toHaveBeenCalled();
        expect(error).toEqual(
          new Error('No AMIOK test scripts provided. Check your amiok.settings.json file')
        );
      }
    });
    it('should throw error when SETTINGS_PREPARE context data is missing', async () => {
      try {
        await testScriptExecute();
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETTINGS_PREPARE context data'));
      }
    });
    it('should throw error when SETTINGS_PREPARE config is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {},
        };
        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing settings config'));
      }
    });
    it('should throw error when STORAGE_PREPARE context data is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
        };
        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing STORAGE_PREPARE context data'));
      }
    });
    it('should throw error when STORAGE_PREPARE storage module is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {},
        };
        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing STORAGE_PREPARE storage module'));
      }
    });
    it('should throw error when STORAGE_PREPARE storage module storeTestResults() is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {},
          },
        };
        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(
          new Error('Missing STORAGE_PREPARE storage module storeTestResults()')
        );
      }
    });
    it('should throw error when TEST_SETUP context data is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTestResults: () => { },
            },
          },
        };
        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing TEST_SETUP context data'));
      }
    });
    it('should throw error when TEST_SETUP test is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTestResults: () => { },
            },
          },
          [PROCESS_ENUM.SETUP_TEST]: {},
        };
        await testScriptExecute(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing TEST_SETUP test'));
      }
    });
  });
});
