const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const statsAnalyze = require('../../../src/process/stats/analyze');

jest.mock('../../../src/modules/doctor', () => ({
  getAnalysisFile: jest.fn((pid) => new Promise((resolve) => {
    if (pid === 404) {
      resolve();
    } else {
      resolve(JSON.stringify([
        { timestamp: 3, memory: {} },
        { timestamp: 7, memory: {} },
        { timestamp: 15, memory: {} },
      ]));
    }
  })),
}));

describe('Stats Analyze Process Tests', () => {
  const mockData = new Chance();
  describe('happy path', () => {
    it('should return new context data containing the formatted analysis results', async () => {
      try {
        const storeReportFile = jest.fn();
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: { apiPid: mockData.integer() },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: 5,
            endTime: 10,
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeReportFile,
            },
          },
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
        };

        const newCtxData = await statsAnalyze(undefined, context);

        expect(storeReportFile).toHaveBeenCalled();
        expect(newCtxData.key).toBe(PROCESS_ENUM.STATS_ANALYZE);
        expect(newCtxData.results).toHaveLength(3);
        expect(newCtxData.results[0]).toHaveProperty('itemCount', 1);
        expect(newCtxData.results[0]).toHaveProperty('rangeType', 'start');
        expect(newCtxData.results[1]).toHaveProperty('itemCount', 1);
        expect(newCtxData.results[1]).toHaveProperty('rangeType', 'tests');
        expect(newCtxData.results[2]).toHaveProperty('itemCount', 1);
        expect(newCtxData.results[2]).toHaveProperty('rangeType', 'end');
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should return new context data containing the formatted analysis results', async () => {
      try {
        const storeReportFile = jest.fn();
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: { apiPid: 404 },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: 5,
            endTime: 10,
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeReportFile,
            },
          },
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {
            test: {
              id: mockData.integer(),
            }
          },
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Invalid analysis file generated by Clinic Doctor.'));
      }
    });
    it('should throw an error when INFO_API_PID is missing', async () => {
      try {
        const context = {};

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing INFO_API_PID context data'));
      }
    });
    it('should throw an error when INFO_API_PID apiPid is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: {},
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing API PID'));
      }
    });
    it('should throw an error when SCRIPT_EXECUTE context data is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: { apiPid: 404 },
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing SCRIPT_EXECUTE context data'));
      }
    });
    it('should throw an error when STORAGE_PREPARE context data is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: { apiPid: 404 },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: 5,
            endTime: 10,
          },
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing STORAGE_PREPARE context data'));
      }
    });
    it('should throw an error when STORAGE_PREPARE storage module is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: { apiPid: 404 },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: 5,
            endTime: 10,
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {},
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing STORAGE_PREPARE storage module'));
      }
    });
    it('should throw an error when STORAGE_PREPARE storage module storeReportFile() is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: { apiPid: 404 },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: 5,
            endTime: 10,
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {},
          },
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing STORAGE_PREPARE storage module storeReportFile()'));
      }
    });
    it('should throw an error when STORAGE_TEST_SETUP context data is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: { apiPid: 404 },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: 5,
            endTime: 10,
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeReportFile: () => { },
            },
          },
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing STORAGE_TEST_SETUP context data'));
      }
    });
    it('should throw an error when STORAGE_TEST_SETUP test is missing', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: { apiPid: 404 },
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime: 5,
            endTime: 10,
          },
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeReportFile: () => { },
            },
          },
          [PROCESS_ENUM.STORAGE_TEST_SETUP]: {},
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing STORAGE_TEST_SETUP test'));
      }
    });
  });
});