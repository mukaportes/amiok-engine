const fs = require('fs/promises');
const { createReadStream } = require('fs');
const readline = require('readline');
const Stream = require('stream');
const { createFile } = require('./file');

/**
 *
 * @param {StatsTemplate} results
 * @param {StatsTemplate} resultItem
 * @returns {StatsTemplate}
 */
const mergeItemToResults = (results, resultItem) => {
  const formattedResults = { ...results };

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

/**
 *
 * @param {string | number} value
 * @returns {number}
 */
const toMB = (value) => Number(value) / 1024 / 1024;

/**
 *
 * @param {StatsTemplate} results
 * @param {string} rangeType
 * @returns {StatsTemplateDb}
 */
const formatAverageResults = (results, rangeType) => ({
  cpu: results.cpu / results.itemCount,
  memoryRss: results.memory.rss / results.itemCount,
  memoryHeapTotal: results.memory.heapTotal / results.itemCount,
  memoryHeapUsed: results.memory.heapUsed / results.itemCount,
  memoryExternal: results.memory.external / results.itemCount,
  memoryArrayBuffers: results.memory.arrayBuffers / results.itemCount,
  handles: results.handles / results.itemCount,
  itemCount: results.itemCount,
  rangeType,
});

/**
 *
 * @returns {StatsTemplate}
 */
const getStatsTemplate = () => ({
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

/**
 *
 * @returns {SequenceStats}
 */
const getRoundStatsTemplate = () => ({
  responseStatus: {},
  logs: [],
  assert: {
    pass: 0,
    fail: 0,
  },
});

// GLOBAL STORE OF TEST UID

/**
 *
 * @param {string} testId
 */
const setCurrentTestId = (testId) => {
  global.amiokCurrentTestId = testId;
};

/**
 *
 * @returns {ReportFilePathData}
 */
const getReportFilePath = () => {
  const fileFolder = `${process.cwd()}/_amiokstats`;
  const fileName = `${global.amiokCurrentTestId}.stat`;

  return {
    fileFolder,
    fileName,
    path: `${fileFolder}/${fileName}`,
  };
};

/**
 *
 * @param {StatsTemplate} stats
 * @param {string} line
 */
const processStatsRow = (stats, line) => {
  const [
    cpu,
    memoryRss,
    memoryHeapTotal,
    memoryHeapUsed,
    memoryExternal,
    memoryArrayBuffers,
    numActiveHandles,
  ] = line;

  return mergeItemToResults(stats, {
    cpu: Number(cpu),
    memory: {
      rss: toMB(Number(memoryRss)),
      heapTotal: toMB(Number(memoryHeapTotal)),
      heapUsed: toMB(Number(memoryHeapUsed)),
      external: toMB(Number(memoryExternal)),
      arrayBuffers: toMB(Number(memoryArrayBuffers)),
    },
    handles: Number(numActiveHandles),
  });
};

/**
 *
 * @param {string} newLine
 * @returns {Promise}
 */
const addStatsToFile = async (newLine) => {
  const { path } = getReportFilePath();
  await fs.appendFile(path, `${newLine}\n`);
};

/**
 *
 * @param {string} testId
 * @returns {boolean}
 */
const createStatsFile = async () => {
  try {
    const { fileFolder, fileName } = getReportFilePath();
    await createFile(fileFolder, fileName);

    return true;
  } catch (error) {
    console.error('Error creating stats file', error);
    return false;
  }
};

/**
 *
 * @param {string} filePath
 * @param {function} processLineFn
 * @param {StatsTemplate} statsTemplate
 * @returns
 */
const readReportFileLines = ({ filePath, startTime, endTime }) =>
  new Promise((resolve, reject) => {
    try {
      const results = {
        start: getStatsTemplate(),
        tests: getStatsTemplate(),
        end: getStatsTemplate(),
      };

      const inputStream = createReadStream(filePath);
      const outputStream = new Stream();
      const rlInterface = readline.createInterface(inputStream, outputStream);

      rlInterface.on('line', (newLine) => {
        const splitLine = newLine.split('|');
        const dateStr = splitLine.pop();
        const date = new Date(dateStr);
        console.log('date', date);
        let resultsKey = 'end';

        if (date.getTime() < startTime) {
          resultsKey = 'start';
        } else if (date.getTime() <= endTime) {
          resultsKey = 'tests';
        }

        results[resultsKey] = processStatsRow(results[resultsKey], splitLine);
      });

      rlInterface.on('close', () => resolve(results));
    } catch (error) {
      console.error('Error while reading report file', error);

      reject(new Error(error));
    }
  });

module.exports = {
  mergeItemToResults,
  toMB,
  formatAverageResults,
  getStatsTemplate,
  getRoundStatsTemplate,
  createStatsFile,
  processStatsRow,
  addStatsToFile,
  setCurrentTestId,
  getReportFilePath,
  readReportFileLines,
};
