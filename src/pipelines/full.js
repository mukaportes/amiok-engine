const startDoctor = require('../process/clinic-doctor/start');
const prepareTestScripts = require('../process/test-script/prepare');
const executeTestScripts = require('../process/test-script/execute');
const analyzeStats = require('../process/stats/analyze');
const clearDoctor = require('../process/clinic-doctor/clear');
const shutdownDoctor = require('../process/clinic-doctor/shutdown');
const getInfoApiPid = require('../process/info/api-pid');

module.exports = async (params) => {
  const context = {};
  const steps = [
    prepareTestScripts,
    startDoctor,
    getInfoApiPid,
    executeTestScripts,
    shutdownDoctor,
  ];

  params.collectCallback = (filePath) => {
    const updatedParams = { ...params, filePath };

    analyzeStats(updatedParams, context)
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
