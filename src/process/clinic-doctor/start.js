const PROCESS_ENUM = require('../../enums/process');
const { execDoctor } = require('../../modules/doctor');

module.exports = async ({ appStarterPath = '.' }, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_START}`);
  try {
    await execDoctor(appStarterPath, ({ filePath }) => {
      if (context[PROCESS_ENUM.DOCTOR_START]) context[PROCESS_ENUM.DOCTOR_START] = { filePath };
      else context[PROCESS_ENUM.DOCTOR_START].filePath = filePath;
    });

    return { key: PROCESS_ENUM.DOCTOR_START };
  } catch (error) {
    console.error('error executing start server process', error);

    throw error;
  }
};
