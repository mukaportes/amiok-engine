const setItemResults = (results, resultItem) => {
  results.delay += resultItem.delay;
  results.cpu += resultItem.cpu;
  results.memory.rss += resultItem.memory.rss;
  results.memory.heapTotal += resultItem.memory.heapTotal;
  results.memory.heapUsed += resultItem.memory.heapUsed;
  results.memory.external += resultItem.memory.external;
  results.memory.arrayBuffers += resultItem.memory.arrayBuffers;
  results.handles += resultItem.handles;
  results.itemCount += 1;
};

const toMB = (value) => Number(value) / 1024 / 1024;

const formatAverageResults = (results, rangeType) => ({
  delay: results.delay / results.itemCount,
  cpu: results.cpu / results.itemCount,
  memoryRss: toMB(results.memory.rss / results.itemCount),
  memoryHeapTotal: toMB(results.memory.heapTotal / results.itemCount),
  memoryHeapUsed: toMB(results.memory.heapUsed / results.itemCount),
  memoryExternal: toMB(results.memory.external / results.itemCount),
  memoryArrayBuffers: toMB(results.memory.arrayBuffers / results.itemCount),
  handles: results.handles / results.itemCount,
  itemCount: results.itemCount,
  rangeType,
});

const getStatsTemplate = () => ({
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

const getRoundStatsTemplate = () => ({
  responseStatus: {},
  logs: [],
  assert: {
    pass: 0,
    fail: 0,
  },
});

const updateRoundStats = (stats, roundResults) => {
  roundResults.forEach(({ responseStatus, assert, logs = [] }) => {
    Object.keys(responseStatus).forEach((status) => {
      stats.responseStatus[status] += responseStatus[status];
    });

    stats.assert.pass += assert.pass;
    stats.assert.fail += assert.fail;

    stats.logs.push(...logs);
  });
};

module.exports = {
  updateRoundStats,
  setItemResults,
  toMB,
  formatAverageResults,
  getStatsTemplate,
  getRoundStatsTemplate,
};
