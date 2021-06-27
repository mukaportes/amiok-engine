const PROCESS_ENUM = require('../../enums/process');

module.exports = async (_, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_SHUTDOWN}`);
  try {
    const { apiPid } = context[PROCESS_ENUM.INFO_API_PID];

    process.kill(apiPid, 'SIGINT');

    return { key: PROCESS_ENUM.DOCTOR_SHUTDOWN };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.DOCTOR_SHUTDOWN} process`, error);

    throw error;
  }
};
