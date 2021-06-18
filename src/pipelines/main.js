const startDoctor = require('../process/clinic-doctor/start');
const clearDoctor = require('../process/clinic-doctor/clear');

module.exports = async (params) => {
  const steps = [startDoctor];
  const context = {};

  try {
    process.on('SIGINT', function () {
      setTimeout(() => {
        console.log("Caught interrupt signal");
        clearDoctor(params, context);
        
      }, 5000);
    });

    for (let i = 0; i < steps.length; i += 1) {
      const { key, ...values } = await steps[i](params, context);

      context[key] = values;
    }
  } catch (error) {
    console.error('Error execting MAIN pipeline', error);

    throw error;
  }
};
