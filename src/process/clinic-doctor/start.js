const PROCESS_ENUM = require('../../enums/process');
const { execDoctor } = require('../../modules/doctor');

const waitAppStart = ({ staticDelay = 5000 }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, staticDelay);
  });

module.exports = async ({ entrypointPath = '.', collectCallback }, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_START}`);
  try {
    const { config = {} } = context[PROCESS_ENUM.SETTINGS_PREPARE];

    await execDoctor(entrypointPath, ({ filePath }) => {
      if (!context[PROCESS_ENUM.DOCTOR_START]) context[PROCESS_ENUM.DOCTOR_START] = { filePath };
      else context[PROCESS_ENUM.DOCTOR_START].filePath = filePath;

      collectCallback(filePath);
    });

    await waitAppStart(config);

    return { key: PROCESS_ENUM.DOCTOR_START };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.DOCTOR_START} process`, error);

    throw error;
  }
};
