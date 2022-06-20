const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const storeTest = require('../../../src/process/storage/store-test');

describe('Storage Store Test Process Tests', () => {
  const randomData = new Chance();

  describe('happy path', () => {
    it('should store tests and return new context data', async () => {
      try {
        const storeTestMock = jest.fn();
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: randomData.string(),
              basePath: randomData.url(),
              rounds: randomData.integer(),
              threads: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: randomData.integer(),
            endTime: randomData.integer(),
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTest: storeTestMock,
            },
          },
        };
        const newCtxData = await storeTest(undefined, context);

        expect(storeTestMock).toHaveBeenCalledWith({
          id: context[PROCESS_ENUM.SETUP_TEST].test.id,
          title: context[PROCESS_ENUM.SETTINGS_PREPARE].config.title,
          basePath: context[PROCESS_ENUM.SETTINGS_PREPARE].config.basePath,
          roundCount: context[PROCESS_ENUM.SETTINGS_PREPARE].config.rounds,
          threadCount: context[PROCESS_ENUM.SETTINGS_PREPARE].config.threads,
          startedAt: context[PROCESS_ENUM.SCRIPT_EXECUTE].startTime,
          endedAt: context[PROCESS_ENUM.SCRIPT_EXECUTE].endTime,
        });
        expect(newCtxData.key).toBe(PROCESS_ENUM.STORAGE_TEST_RESULT);
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw an error when TEST_SETUP context data is invalid', async () => {
      try {
        await storeTest();
      } catch (error) {
        expect(error).toEqual(new Error('Missing TEST_SETUP context data'));
      }
    });
    it('should throw an error when TEST_SETUP test is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {},
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing storage test data'));
      }
    });
    it('should throw an error when SETTINGS_PREPARE context data is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: randomData.integer(),
            },
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing SETTINGS_PREPARE context data'));
      }
    });
    it('should throw an error when SETTINGS_PREPARE config is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing settings config'));
      }
    });
    it('should throw an error when SCRIPT_EXECUTE context data is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: randomData.string(),
              basePath: randomData.url(),
              rounds: randomData.integer(),
              threads: randomData.integer(),
            },
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing SCRIPT_EXECUTE context data'));
      }
    });
    it('should throw an error when STORAGE_PREPARE context data is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: randomData.string(),
              basePath: randomData.url(),
              rounds: randomData.integer(),
              threads: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: randomData.integer(),
            endTime: randomData.integer(),
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing STORAGE_PREPARE context data'));
      }
    });
    it('should throw an error when STORAGE_PREPARE storage module is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: randomData.string(),
              basePath: randomData.url(),
              rounds: randomData.integer(),
              threads: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: randomData.integer(),
            endTime: randomData.integer(),
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {},
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing STORAGE_PREPARE storage module'));
      }
    });
    it('should throw an error when STORAGE_PREPARE storage module storeTest() is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: randomData.string(),
              basePath: randomData.url(),
              rounds: randomData.integer(),
              threads: randomData.integer(),
            },
          },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: randomData.integer(),
            endTime: randomData.integer(),
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTest: randomData.string(),
            },
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing STORAGE_PREPARE storage module storeTest()'));
      }
    });
  });
});
