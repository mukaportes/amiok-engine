const PROCESS_ENUM = require('../../enums/process');
const { createStatsFile } = require('../../modules/stats');

/**
 *
 * @param {Params} _
 * @param {Context} context
 * @returns {NewContextData}
 */
module.exports = async (_, context = {}) => {
  try {
    console.info(`Executing process ${PROCESS_ENUM.SETUP_STATS_FILE}`);

    const testId = context[PROCESS_ENUM.SETUP_TEST].test.id;
    await createStatsFile(testId);

    return { key: PROCESS_ENUM.SETUP_STATS_FILE };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.SETUP_STATS_FILE} process`, error);

    throw error;
  }
};
