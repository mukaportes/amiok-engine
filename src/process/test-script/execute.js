const { runSequence } = require('../../modules/http');
const { updateRoundStats, getRoundStatsTemplate } = require('../../modules/stats');
const PROCESS_ENUM = require('../../enums/process');

const updateStats = (stats, roundResults) => {
  roundResults.forEach(({
    responseStatus, assert, logs = [],
  }) => {
    Object.keys(responseStatus).forEach(status => {
      stats.responseStatus[status] += responseStatus[status];
    });

    stats.assert.pass += assert.pass;
    stats.assert.fail += assert.fail;

    stats.logs.push(...logs);
  });
};

const waitAfterExecute = ({ staticDelay = 5000 }) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, staticDelay)
});

module.exports = async ({ }, context) => {
  console.info(`Executing process ${PROCESS_ENUM.SCRIPT_EXECUTE}`);
  const startTime = new Date().getTime();
  try {
    const { config: {
      basePath,
      // runInSequence = true,
      rounds = 200,
      threads = 10,
      testScripts = [],
      staticDelay,
    } } = context[PROCESS_ENUM.SCRIPT_PREPARE];

    const executionRoundsStats = getRoundStatsTemplate();

    if (!basePath) throw 'No valid AMIOK scripts basePath provided. Check your amiok-scripts.json file';
    if (!Array.isArray(testScripts) || !testScripts.length) throw 'No AMIOK test scripts provided. Check your amiok-scripts.json file';

    for (let round = 0; round < rounds; round += 1) {
      const roundResults = await Promise.all([...new Array(threads)].map(() => runSequence(testScripts)));

      updateRoundStats(executionRoundsStats, roundResults);
      console.info(`Executed round ${round}`);
    }

    const endTime = new Date().getTime();
    await waitAfterExecute({ staticDelay });

    return { key: PROCESS_ENUM.SCRIPT_EXECUTE, executionRoundsStats, startTime, endTime };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.SCRIPT_EXECUTE} process`, error);

    throw error;
  }
};