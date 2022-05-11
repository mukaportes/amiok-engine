const PROCESS_ENUM = require('../../enums/process');
const { netstatByPort } = require('../../modules/cmd');

module.exports = async (_, context) => {
  console.info(`Executing process ${PROCESS_ENUM.INFO_API_PID}`);
  try {
    const { config } = context[PROCESS_ENUM.SETTINGS_PREPARE];
    const subProcess = await netstatByPort(config.port);

    if (!subProcess) throw new Error('No process running in the port given');

    return { key: PROCESS_ENUM.INFO_API_PID, apiPid: subProcess.pid };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.INFO_API_PID} process`, error);

    throw error;
  }
};
