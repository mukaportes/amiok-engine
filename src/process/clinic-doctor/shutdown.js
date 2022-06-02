const PROCESS_ENUM = require('../../enums/process');

const validate = (context) => {
  if (!context[PROCESS_ENUM.INFO_API_PID]) throw new Error('Missing INFO_API_PID context data');
  if (!context[PROCESS_ENUM.INFO_API_PID].apiPid) throw new Error('Missing API PID');
};

/**
 * 
 * @param {Params} _ 
 * @param {Context} context 
 * @returns {NewContextData}
 */
module.exports = async (_, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_SHUTDOWN}`);
  try {
    validate(context);
    const { apiPid } = context[PROCESS_ENUM.INFO_API_PID];

    process.kill(apiPid, 'SIGINT');

    return { key: PROCESS_ENUM.DOCTOR_SHUTDOWN };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.DOCTOR_SHUTDOWN} process`, error);

    throw error;
  }
};
