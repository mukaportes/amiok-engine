const setItemResults = (results, resultItem) => {
  const formattedResults = { ...results };

  formattedResults.delay += resultItem.delay;
  formattedResults.cpu += resultItem.cpu;
  formattedResults.memory.rss += resultItem.memory.rss;
  formattedResults.memory.heapTotal += resultItem.memory.heapTotal;
  formattedResults.memory.heapUsed += resultItem.memory.heapUsed;
  formattedResults.memory.external += resultItem.memory.external;
  formattedResults.memory.arrayBuffers += resultItem.memory.arrayBuffers;
  formattedResults.handles += resultItem.handles;
  formattedResults.itemCount += 1;

  return formattedResults;
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

module.exports = {
  setItemResults,
  toMB,
  formatAverageResults,
  getStatsTemplate,
  getRoundStatsTemplate,
};
