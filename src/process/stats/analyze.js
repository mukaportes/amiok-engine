const PROCESS_ENUM = require('../../enums/process');
const {
  formatAverageResults,
  getReportFilePath,
  processStatsRow,
  readReportFileLines,
} = require('../../modules/stats');

const validate = (context) => {
  if (!context[PROCESS_ENUM.SCRIPT_EXECUTE]) throw new Error('Missing SCRIPT_EXECUTE context data');
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

    const { path: filePath } = getReportFilePath();
    const { startTime, endTime } = context[PROCESS_ENUM.SCRIPT_EXECUTE];
    const results = await readReportFileLines({
      filePath,
      processLineFn: processStatsRow,
      startTime,
      endTime,
    });

    const { id } = context[PROCESS_ENUM.SETUP_TEST].test;
    const formattedResults = Object.keys(results).map((key) =>
      formatAverageResults(results[key], key)
    );

    await context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeResourceStats(id, formattedResults);

    return { key: PROCESS_ENUM.STATS_ANALYZE };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.STATS_ANALYZE} process`, error);

    throw error;
  }
};
