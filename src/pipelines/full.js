const PROCESS_ENUM = require('../enums/process');
const startDoctor = require('../process/clinic-doctor/start');
const prepareSettings = require('../process/settings/prepare');
const executeTestScripts = require('../process/test-script/execute');
const analyzeStats = require('../process/stats/analyze');
const clearDoctor = require('../process/clinic-doctor/clear');
const shutdownDoctor = require('../process/clinic-doctor/shutdown');
const getInfoApiPid = require('../process/info/api-pid');
const prepareStorage = require('../process/storage/prepare');
const setupTest = require('../process/storage/setup-test');
const storeTest = require('../process/storage/store-test');

module.exports = async (params) => {
  const context = {};
  const steps = [
    prepareSettings,
    prepareStorage,
    startDoctor,
    getInfoApiPid,
    setupTest,
    executeTestScripts,
    storeTest,
    shutdownDoctor,
  ];

  params.collectCallback = (filePath) => {
    const updatedParams = { ...params, filePath };
    const {
      storage: { storeResourceStats },
    } = context[PROCESS_ENUM.STORAGE_PREPARE];

    analyzeStats(updatedParams, context)
      .then(({ results }) =>
        storeResourceStats(context[PROCESS_ENUM.STORAGE_TEST_SETUP].test.id, results)
      )
      .then(() => clearDoctor(updatedParams, context))
      .catch((error) => {
        console.error('Error at collectCallback()', error);

        throw error;
      });
  };

  try {
    for (let i = 0; i < steps.length; i += 1) {
      const { key, ...values } = await steps[i](params, context);

      context[key] = values;
    }
  } catch (error) {
    console.error('Error execting MAIN pipeline', error);

    process.kill(process.pid, 1);
  }
};
