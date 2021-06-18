const startDoctor = require('../process/clinic-doctor/start');

module.exports = async (params) => {
  const steps = [startDoctor];
  const context = {};

  try {
    for (let i = 0; i < steps.length; i += 1) {
      const processExec = await steps[i](params, context);

      context[steps[i].name] = processExec;
    }

    await startDoctor(params, context);
  } catch (error) {
    console.error('Error execting MAIN pipeline', error);

    throw error;
  }
};
