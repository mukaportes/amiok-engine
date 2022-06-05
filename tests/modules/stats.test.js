const Chance = require('chance');
const statsModule = require('../../src/modules/stats');

describe('Stats Module Tests', () => {
  const randomData = new Chance();

  describe('mergeItemToResults()', () => {
    describe('happy path', () => {
      it('returns formatted results', () => {
        const results = statsModule.getStatsTemplate();
        const item = statsModule.getStatsTemplate();

        item.delay = randomData.integer();
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

        results.delay = randomData.integer();
        results.cpu = randomData.integer();
        results.memory.rss = randomData.integer();
        results.memory.heapTotal = randomData.integer();
        results.memory.heapUsed = randomData.integer();
        results.memory.external = randomData.integer();
        results.memory.arrayBuffers = randomData.integer();
        results.handles = randomData.integer();
        results.itemCount = itemCount;

        const formattedAverage = statsModule.formatAverageResults(results, rangeType);

        expect(formattedAverage.delay).toBe(results.delay / itemCount);
        expect(formattedAverage.cpu).toBe(results.cpu / itemCount);
        expect(formattedAverage.memoryArrayBuffers).toBe(
          statsModule.toMB(results.memory.arrayBuffers / itemCount)
        );
        expect(formattedAverage.memoryHeapTotal).toBe(
          statsModule.toMB(results.memory.heapTotal / itemCount)
        );
        expect(formattedAverage.memoryHeapUsed).toBe(
          statsModule.toMB(results.memory.heapUsed / itemCount)
        );
        expect(formattedAverage.memoryExternal).toBe(
          statsModule.toMB(results.memory.external / itemCount)
        );
        expect(formattedAverage.memoryRss).toBe(statsModule.toMB(results.memory.rss / itemCount));
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
          delay: 0,
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
});
