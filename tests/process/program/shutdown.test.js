const fs = require('fs/promises');
const Chance = require('chance');
const programShutdownProcess = require('../../../src/process/program/shutdown');
const PROCESS_ENUM = require('../../../src/enums/process');

jest.mock('fs/promises', () => ({
  readFile: jest.fn().mockResolvedValue({}),
  rm: jest.fn().mockResolvedValue({}),
}))

describe('Program Shutdown Process Tests', () => {
  const randomData = new Chance();

  describe('happy path', () => {
    it('should return new context data and remove reports folder when config persist reports is set to false', async () => {
      try {
        const stubProcess = jest.spyOn(global.process, 'kill').mockImplementation(() => { });
        const mockStoreReportFile = jest.fn().mockResolvedValue();
        const testId = randomData.string();
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              persistReports: false,
            },
          },
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: testId,
            }
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeReportFile: mockStoreReportFile,
            },
          },
        };

        const ctxData = await programShutdownProcess(undefined, context);

        expect(fs.readFile).not.toHaveBeenCalled();
        expect(fs.readFile).not.toHaveBeenCalled();
        expect(mockStoreReportFile).not.toHaveBeenCalled();
        expect(ctxData).toHaveProperty('key', PROCESS_ENUM.PROGRAM_SHUTDOWN);
        expect(stubProcess).toHaveBeenCalledWith(process.pid, 0);
      } catch (error) {
        throw new Error(error);
      }
    });
    it('should return new context data and store report file when config persist reports is set to true', async () => {
      try {
        const stubProcess = jest.spyOn(global.process, 'kill').mockImplementation(() => { });
        const mockStoreReportFile = jest.fn().mockResolvedValue();
        const testId = randomData.string();
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              persistReports: true,
            },
          },
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: testId,
            }
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeReportFile: mockStoreReportFile,
            },
          },
        };

        const ctxData = await programShutdownProcess(undefined, context);

        expect(fs.readFile).toHaveBeenCalled();
        expect(mockStoreReportFile).toHaveBeenCalledWith(testId, {});
        expect(ctxData).toHaveProperty('key', PROCESS_ENUM.PROGRAM_SHUTDOWN);
        expect(stubProcess).toHaveBeenCalledWith(process.pid, 0);
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw an error when SETTINGS_PREPARE context data is not found', async () => {
      try {
        await programShutdownProcess();
      } catch (error) {
        expect(error.message).toBe('Missing SETTINGS_PREPARE context data');
      }
    });
    it('should throw an error when SETTINGS_PREPARE config is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {},
        };

        await programShutdownProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing SETTINGS_PREPARE config');
      }
    });
    it('should throw an error when STORAGE_PREPARE context data is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              persistReports: true,
            },
          },
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {}
          },
        };

        await programShutdownProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing STORAGE_PREPARE context data');
      }
    });
    it('should throw an error when STORAGE_PREPARE storage module is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              persistReports: true,
            },
          },
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {}
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {},
        };

        await programShutdownProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing STORAGE_PREPARE storage module');
      }
    });
    it('should throw an error when SETTINGS_PREPARE storage module store reports file method is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              persistReports: true,
            },
          },
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {}
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {},
          },
        };

        await programShutdownProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing STORAGE_PREPARE storage module store reports file method');
      }
    });
    it('should throw an error when SETUP_TEST context data is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              persistReports: true,
            },
          },
        };

        await programShutdownProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing SETUP_TEST context data');
      }
    });
    it('should throw an error when SETUP_TEST test data is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              persistReports: true,
            },
          },
          [PROCESS_ENUM.SETUP_TEST]: {},
        };

        await programShutdownProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing SETUP_TEST test data');
      }
    });
  });
});