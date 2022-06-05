const appStart = require('../process/app/start');
const appShutdown = require('../process/app/shutdown');
const programShutdown = require('../process/program/shutdown');
const prepareSettings = require('../process/settings/prepare');
const executeTestScripts = require('../process/test-script/execute');
const analyzeStats = require('../process/stats/analyze');
const getInfoApiPid = require('../process/info/api-pid');
const prepareStorage = require('../process/storage/prepare');
const setupTest = require('../process/setup/test');
const storeTest = require('../process/storage/store-test');

module.exports = async (params) => {
  const context = {};
  const steps = [
    prepareSettings,
    prepareStorage,
    appStart,
    setupTest,
    getInfoApiPid,
    executeTestScripts,
    appShutdown,
    analyzeStats,
    storeTest,
    programShutdown,
  ];

  try {
    for (let i = 0; i < steps.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { key, ...values } = await steps[i](params, context);

      context[key] = values;
    }
  } catch (error) {
    console.error('Error execting MAIN pipeline', error);

    process.kill(process.pid, 1);
  }
};
