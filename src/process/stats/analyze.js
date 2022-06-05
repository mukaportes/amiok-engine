const PROCESS_ENUM = require('../../enums/process');
const { readFileLines } = require('../../modules/file');
const {
  formatAverageResults,
  getReportFilePath,
  getStatsTemplate,
  processStatsRow,
} = require('../../modules/stats');

const validate = (context) => {
  if (!context[PROCESS_ENUM.SCRIPT_EXECUTE]) throw new Error('Missing SCRIPT_EXECUTE context data');
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

    // const { startTime, endTime } = context[PROCESS_ENUM.SCRIPT_EXECUTE];

    const { path } = getReportFilePath();
    console.log('path @ analyzeProcess', path);
    const statsTemplate = getStatsTemplate();
    const results = await readFileLines(path, processStatsRow, statsTemplate);

    return { key: PROCESS_ENUM.STATS_ANALYZE, results: formatAverageResults(results) };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.STATS_ANALYZE} process`, error);

    throw error;
  }
};
