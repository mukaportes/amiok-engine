const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const statsAnalyze = require('../../../src/process/stats/analyze');
const { readFileLines } = require('../../../src/modules/file');
const {
  formatAverageResults,
  getReportFilePath,
  getStatsTemplate,
  processStatsRow,
} = require('../../../src/modules/stats');

jest.mock('../../../src/modules/stats', () => ({
  formatAverageResults: jest.fn(input => input),
  getReportFilePath: jest.fn(() => ({
    path: '/path/file.js',
  })),
  getStatsTemplate: jest.fn(() => ({
    cpu: 0,
    memory: {
      rss: 0,
      heapTotal: 0,
      heapUsed: 0,
      external: 0,
      arrayBuffers: 0,
    },
    handles: 0,
    itemCount: 0,
  })),
  processStatsRow: jest.fn(),
}));

jest.mock('../../../src/modules/file', () => ({
  readFileLines: jest.fn().mockResolvedValue({ example: true }),
}));

describe('Stats Analyze Process Tests', () => {
  const mockData = new Chance();

  describe('happy path', () => {
    it('should return new context data containing the formatted analysis results', async () => {
      try {
        const storeResourceStats = jest.fn();
        const testId = mockData.string();
        const context = {
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {
              storeResourceStats,
            },
          },
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: testId,
            },
          },
        };

        const newCtxData = await statsAnalyze(undefined, context);

        expect(newCtxData.key).toBe(PROCESS_ENUM.STATS_ANALYZE);
        expect(storeResourceStats).toHaveBeenCalledWith(
          testId,
          [{ example: true }],
        );
        expect(formatAverageResults).toHaveBeenCalledWith(
          { example: true }
        );
        expect(getReportFilePath).toHaveBeenCalled();
        expect(getStatsTemplate).toHaveBeenCalled();
        expect(readFileLines).toHaveBeenCalledWith(
          '/path/file.js',
          processStatsRow,
          {
            cpu: 0,
            memory: {
              rss: 0,
              heapTotal: 0,
              heapUsed: 0,
              external: 0,
              arrayBuffers: 0,
            },
            handles: 0,
            itemCount: 0,
          },
        );
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('throws an error when SETUP_TEST context data is not found', async () => {
      try {
        await statsAnalyze();
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETUP_TEST context data'));
      }
    })
    it('throws an error when SETUP_TEST test data is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {},
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETUP_TEST test data'));
      }
    })
    it('throws an error when STORAGE_PREPARE context data is not found', async () => {
      try {
        const testId = mockData.string();
        const context = {
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: testId,
            },
          },
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing STORAGE_PREPARE context data'));
      }
    })
    it('throws an error when STORAGE_PREPARE storage module is not found', async () => {
      try {
        const testId = mockData.string();
        const context = {
          [PROCESS_ENUM.STORAGE_PREPARE]: {},
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: testId,
            },
          },
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing STORAGE_PREPARE storage module'));
      }
    })
    it('throws an error when STORAGE_PREPARE storage module storeResourceStats() is not found', async () => {
      try {
        const testId = mockData.string();
        const context = {
          [PROCESS_ENUM.STORAGE_PREPARE]: {
            storage: {},
          },
          [PROCESS_ENUM.SETUP_TEST]: {
            test: {
              id: testId,
            },
          },
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing STORAGE_PREPARE storage module storeResourceStats()'));
      }
    })
  });
});
