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
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {
            id: mockData.string(),
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
          id: context[PROCESS_ENUM.STORAGE_TEST_SETUP].id,
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
    it('should throw an exception when an error occurs', async () => {
      const stubConsole = jest.spyOn(global.console, 'error');
      try {
        await storeTest();
      } catch (error) {
        expect(stubConsole).toHaveBeenCalled();
      }
    });
  });
});