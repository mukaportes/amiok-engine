const PROCESS_ENUM = require('../../enums/process');
const { readFileLines } = require('../../modules/file');
const {
  formatAverageResults,
  getReportFilePath,
  getStatsTemplate,
  processStatsRow,
} = require('../../modules/stats');

const validate = (context) => {
  if (!context[PROCESS_ENUM.SETUP_TEST]) throw new Error('Missing SETUP_TEST context data');
  if (!context[PROCESS_ENUM.SETUP_TEST].test) throw new Error('Missing SETUP_TEST test data');
  if (!context[PROCESS_ENUM.STORAGE_PREPARE])
    throw new Error('Missing STORAGE_PREPARE context data');
  if (!context[PROCESS_ENUM.STORAGE_PREPARE].storage)
    throw new Error('Missing STORAGE_PREPARE storage module');
  if (!context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeResourceStats)
    throw new Error('Missing STORAGE_PREPARE storage module storeResourceStats()');
};

/**
 *
 * @param {Params} _
 * @param {Context} context
 * @returns {StatsAnalyzeContext}
 */
module.exports = async (_, context = {}) => {
  console.info(`Executing process ${PROCESS_ENUM.STATS_ANALYZE}`);

  try {
    validate(context);

    const { path } = getReportFilePath();
    const statsTemplate = getStatsTemplate();
    const results = await readFileLines(path, processStatsRow, statsTemplate);

    const { id } = context[PROCESS_ENUM.SETUP_TEST].test;
    await context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeResourceStats(id, [
      formatAverageResults(results),
    ]);

    return { key: PROCESS_ENUM.STATS_ANALYZE };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.STATS_ANALYZE} process`, error);

    throw error;
  }
};
