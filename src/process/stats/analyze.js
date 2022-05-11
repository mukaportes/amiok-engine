const { getAnalysisFile } = require('../../modules/doctor');
const { setItemResults, getStatsTemplate, formatAverageResults } = require('../../modules/stats');
const PROCESS_ENUM = require('../../enums/process');

module.exports = async ({}, context) => {
  console.info(`Executing process ${PROCESS_ENUM.STATS_ANALYZE}`);

  try {
    const { apiPid } = context[PROCESS_ENUM.INFO_API_PID];
    const { startTime, endTime } = context[PROCESS_ENUM.SCRIPT_EXECUTE];

    const results = await getAnalysisFile(null, apiPid);

    if (!results) throw new Error('Invalid analysis file generated by Clinic Doctor.');

    const parsedResults = JSON.parse(results);

    const {
      storage: { storeReportFile },
    } = context[PROCESS_ENUM.STORAGE_PREPARE];
    storeReportFile(context[PROCESS_ENUM.STORAGE_TEST_SETUP].id, parsedResults);

    const groupedResults = parsedResults.reduce(
      (acc, item) => {
        let accProp = 'end';

        if (item.timestamp <= startTime) {
          accProp = 'start';
        } else if (item.timestamp <= endTime) {
          accProp = 'tests';
        }

        acc[accProp] = setItemResults(acc[accProp], item);

        return acc;
      },
      {
        start: getStatsTemplate(),
        tests: getStatsTemplate(),
        end: getStatsTemplate(),
      }
    );

    const formattedResults = Object.keys(groupedResults).map((key) =>
      formatAverageResults(groupedResults[key], key)
    );

    return { key: PROCESS_ENUM.STATS_ANALYZE, results: formattedResults };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.STATS_ANALYZE} process`, error);

    throw error;
  }
};
