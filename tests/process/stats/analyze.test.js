const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const statsAnalyze = require('../../../src/process/stats/analyze');
const {
  formatAverageResults,
  getReportFilePath,
  readReportFileLines,
} = require('../../../src/modules/stats');

const statsTemplate = {
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
};

jest.mock('../../../src/modules/stats', () => ({
  formatAverageResults: jest.fn(input => input),
  getReportFilePath: jest.fn(() => ({
    path: '/path/file.js',
  })),
  getStatsTemplate: jest.fn(() => statsTemplate),
  processStatsRow: jest.fn(),
  readReportFileLines: jest.fn().mockResolvedValue({
    start: Object.assign({}, statsTemplate),
    tests: Object.assign({}, statsTemplate),
    end: Object.assign({}, statsTemplate),
  }),
}));

jest.mock('../../../src/modules/file', () => ({
  readFileLines: jest.fn().mockResolvedValue({ example: true }),
}));

describe('Stats Analyze Process Tests', () => {
  const randomData = new Chance();

  describe('happy path', () => {
    it('should return new context data containing the formatted analysis results', async () => {
      try {
        const startTime = randomData.integer();
        const endTime = randomData.integer();
        const storeResourceStats = jest.fn();
        const testId = randomData.string();
        const context = {
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {
            startTime,
            endTime,
          },
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
          [statsTemplate, statsTemplate, statsTemplate],
        );
        console.log('formatAverageResults.mock.calls', formatAverageResults.mock.calls);
        expect(formatAverageResults.mock.calls).toEqual([
          [statsTemplate, 'start'],
          [statsTemplate, 'tests'],
          [statsTemplate, 'end'],
        ]);
        expect(getReportFilePath).toHaveBeenCalled();
        expect(readReportFileLines).toHaveBeenCalledWith({
          filePath: '/path/file.js',
          startTime,
          endTime,
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('throws an error when SCRIPT_EXECUTE context data is not found', async () => {
      try {
        await statsAnalyze();
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SCRIPT_EXECUTE context data'));
      }
    })
    it('throws an error when SETUP_TEST context data is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {},
        };
        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETUP_TEST context data'));
      }
    })
    it('throws an error when SETUP_TEST test data is not found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {},
          [PROCESS_ENUM.SETUP_TEST]: {},
        };

        await statsAnalyze(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETUP_TEST test data'));
      }
    })
    it('throws an error when STORAGE_PREPARE context data is not found', async () => {
      try {
        const testId = randomData.string();
        const context = {
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {},
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
        const testId = randomData.string();
        const context = {
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {},
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
        const testId = randomData.string();
        const context = {
          [PROCESS_ENUM.SCRIPT_EXECUTE]: {},
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
