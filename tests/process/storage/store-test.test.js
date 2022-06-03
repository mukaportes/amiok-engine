const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const storeTest = require('../../../src/process/storage/store-test');

describe('Storage Store Test Process Tests', () => {
  const mockData = new Chance();
  describe('happy path', () => {
    it('should store tests and return new context data', async () => {
      try {
        const storeTestMock = jest.fn();
        const context = {
          [PROCESS_ENUM.TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: mockData.string(),
              basePath: mockData.url(),
              rounds: mockData.integer(),
              threads: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: mockData.integer(),
            endTime: mockData.integer(),
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeTest: storeTestMock,
            },
          },
        };
        const newCtxData = await storeTest(undefined, context);

        expect(storeTestMock).toHaveBeenCalledWith({
          id: context[PROCESS_ENUM.TEST_SETUP].test.id,
          title: context[PROCESS_ENUM.SETTINGS_PREPARE].config.title,
          basePath: context[PROCESS_ENUM.SETTINGS_PREPARE].config.basePath,
          roundCount: context[PROCESS_ENUM.SETTINGS_PREPARE].config.rounds,
          threadCount: context[PROCESS_ENUM.SETTINGS_PREPARE].config.threads,
          startedAt: context[PROCESS_ENUM.SCRIPT_EXECUTE].startTime,
          endedAt: context[PROCESS_ENUM.SCRIPT_EXECUTE].endTime,
        });
        expect(newCtxData.key).toBe(PROCESS_ENUM.STORAGE_TEST);
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw an error when TEST_SETUP context data is missing', async () => {
      try {
        await storeTest();
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing TEST_SETUP context data'));
      }
    });
    it('should throw an error when TEST_SETUP test is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.TEST_SETUP]: {},
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing storage test data'));
      }
    });
    it('should throw an error when SETTINGS_PREPARE context data is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETTINGS_PREPARE context data'));
      }
    });
    it('should throw an error when SETTINGS_PREPARE config is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {},
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing settings config'));
      }
    });
    it('should throw an error when SCRIPT_EXECUTE context data is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: mockData.string(),
              basePath: mockData.url(),
              rounds: mockData.integer(),
              threads: mockData.integer(),
            }
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SCRIPT_EXECUTE context data'));
      }
    });
    it('should throw an error when STORAGE_PREPARE context data is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: mockData.string(),
              basePath: mockData.url(),
              rounds: mockData.integer(),
              threads: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: mockData.integer(),
            endTime: mockData.integer(),
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing STORAGE_PREPARE context data'));
      }
    });
    it('should throw an error when STORAGE_PREPARE storage module is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: mockData.string(),
              basePath: mockData.url(),
              rounds: mockData.integer(),
              threads: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: mockData.integer(),
            endTime: mockData.integer(),
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {},
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing STORAGE_PREPARE storage module'));
      }
    });
    it('should throw an error when STORAGE_PREPARE storage module storeTest() is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              title: mockData.string(),
              basePath: mockData.url(),
              rounds: mockData.integer(),
              threads: mockData.integer(),
            }
          },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: mockData.integer(),
            endTime: mockData.integer(),
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {},
          },
        };
        await storeTest(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing STORAGE_PREPARE storage module storeTest()'));
      }
    });
  });
});