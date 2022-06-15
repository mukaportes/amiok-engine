const fs = require('fs/promises');
const Chance = require('chance');
const statsModule = require('../../src/modules/stats');

jest.mock('fs/promises', () => ({
  access: jest.fn().mockResolvedValue(true),
  appendFile: jest.fn().mockResolvedValue(),
  writeFile: jest.fn((targetPath) => new Promise((resolve, reject) => {
    if (targetPath.indexOf('errorId') > -1) {
      reject('Error creating new report file');
    } else {
      resolve(true);
    }
  })),
}));

describe('Stats Module Tests', () => {
  const randomData = new Chance();

  describe('mergeItemToResults()', () => {
    describe('happy path', () => {
      it('returns formatted results', () => {
        const results = statsModule.getStatsTemplate();
        const item = statsModule.getStatsTemplate();

        item.cpu = randomData.integer();
        item.memory.rss = randomData.integer();
        item.memory.heapTotal = randomData.integer();
        item.memory.heapUsed = randomData.integer();
        item.memory.external = randomData.integer();
        item.memory.arrayBuffers = randomData.integer();
        item.handles = randomData.integer();

        const formattedResults = statsModule.mergeItemToResults(results, item);

        expect(formattedResults).toStrictEqual({
          ...item,
          itemCount: 1,
        });
      });
    });
  });
  describe('formatAverageResults()', () => {
    describe('happy path', () => {
      it('returns formatted average results', () => {
        const results = statsModule.getStatsTemplate();
        const rangeType = randomData.string();
        const itemCount = randomData.integer();

        results.cpu = randomData.integer();
        results.memory.rss = randomData.integer();
        results.memory.heapTotal = randomData.integer();
        results.memory.heapUsed = randomData.integer();
        results.memory.external = randomData.integer();
        results.memory.arrayBuffers = randomData.integer();
        results.handles = randomData.integer();
        results.itemCount = itemCount;

        const formattedAverage = statsModule.formatAverageResults(results, rangeType);

        expect(formattedAverage.cpu).toBe(results.cpu / itemCount);
        expect(formattedAverage.memoryArrayBuffers).toBe(
          results.memory.arrayBuffers / itemCount
        );
        expect(formattedAverage.memoryHeapTotal).toBe(
          results.memory.heapTotal / itemCount
        );
        expect(formattedAverage.memoryHeapUsed).toBe(
          results.memory.heapUsed / itemCount
        );
        expect(formattedAverage.memoryExternal).toBe(
          results.memory.external / itemCount
        );
        expect(formattedAverage.memoryRss).toBe(results.memory.rss / itemCount);
        expect(formattedAverage.handles).toBe(results.handles / itemCount);
        expect(formattedAverage.itemCount).toBe(itemCount);
      });
    });
  });
  describe('getStatsTemplate()', () => {
    describe('happy path', () => {
      it('returns template for stats', () => {
        const template = statsModule.getStatsTemplate();

        expect(template).toStrictEqual({
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
        });
      });
    });
  });
  describe('getRoundStatsTemplate()', () => {
    describe('happy path', () => {
      it('returns template for round stats', () => {
        const template = statsModule.getRoundStatsTemplate();

        expect(template).toStrictEqual({
          responseStatus: {},
          logs: [],
          assert: {
            pass: 0,
            fail: 0,
          },
        });
      });
    });
  });
  describe('setCurrentTestId()', () => {
    describe('happy path', () => {
      it('sets new value to global amiok current test id', () => {
        const testUid = 'someString123!!';
        statsModule.setCurrentTestId(testUid);

        expect(global.amiokCurrentTestId).toBe(testUid);
      });
    });
  });
  describe('getReportFilePath()', () => {
    describe('happy path', () => {
      it('returns object containg reports file path data', () => {
        const pathData = statsModule.getReportFilePath();

        expect(pathData).toHaveProperty('fileFolder', `${process.cwd()}/_amiokstats`);
        expect(pathData).toHaveProperty('fileName', `${global.amiokCurrentTestId}.stat`);
        expect(pathData).toHaveProperty('path', `${process.cwd()}/_amiokstats/${global.amiokCurrentTestId}.stat`);
      });
    });
  });
  describe('processStatsRow()', () => {
    describe('happy path', () => {
      it('returns merged new values to the results object given', () => {
        const results = statsModule.getStatsTemplate();

        const cpu = randomData.integer({ min: 1, max: 100 });
        const memoryRss = randomData.integer({ min: 1, max: 100 });
        const memoryHeapTotal = randomData.integer({ min: 1, max: 100 });
        const memoryHeapUsed = randomData.integer({ min: 1, max: 100 });
        const memoryExternal = randomData.integer({ min: 1, max: 100 });
        const memoryArrayBuffers = randomData.integer({ min: 1, max: 100 });
        const numActiveHandles = randomData.integer({ min: 1, max: 100 });

        const line = `${cpu}|${memoryRss}|${memoryHeapTotal}|${memoryHeapUsed}|${memoryExternal}|${memoryArrayBuffers}|${numActiveHandles}`;

        const processedResults = statsModule.processStatsRow(results, line);

        expect(processedResults.cpu).toBe(Number(cpu));
        expect(processedResults.memory.rss).toBe(statsModule.toMB(memoryRss));
        expect(processedResults.memory.heapTotal).toBe(statsModule.toMB(memoryHeapTotal));
        expect(processedResults.memory.heapUsed).toBe(statsModule.toMB(memoryHeapUsed));
        expect(processedResults.memory.external).toBe(statsModule.toMB(memoryExternal));
        expect(processedResults.memory.arrayBuffers).toBe(statsModule.toMB(memoryArrayBuffers));
        expect(processedResults.handles).toBe(Number(numActiveHandles));
      });
    });
  });
  describe('addStatsToFile()', () => {
    describe('happy path', () => {
      it('appends new line given to report file', async () => {
        const { path } = statsModule.getReportFilePath();
        const newLine = randomData.string();
        await statsModule.addStatsToFile(newLine);

        expect(fs.appendFile).toHaveBeenCalledWith(path, `${newLine}\n`);
      });
    });
  });
  describe('createStatsFile()', () => {
    describe('happy path', () => {
      it('returns true when the report file creation is successful', async () => {
        const { fileFolder, fileName } = statsModule.getReportFilePath();
        const creationRes = await statsModule.createStatsFile();

        expect(creationRes).toBe(true);
        expect(fs.access).toHaveBeenCalled();
        expect(fs.writeFile).toHaveBeenCalledWith(`${fileFolder}/${fileName}`, '');
      });
    });
    describe('unhappy path', () => {
      it('returns false when the report file creation has an error', async () => {
        statsModule.setCurrentTestId('errorId');
        const creationRes = await statsModule.createStatsFile();

        expect(creationRes).toBe(false);
        expect(fs.access).toHaveBeenCalled();
        expect(fs.writeFile).toHaveBeenCalled();
      });
    });
  });
});
