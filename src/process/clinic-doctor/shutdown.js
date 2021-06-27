const { netstatByPort } = require('../../modules/cmd');
const PROCESS_ENUM = require('../../enums/process');

module.exports = async (_, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_SHUTDOWN}`);
  try {
    const { config: { port } } = context[PROCESS_ENUM.SCRIPT_PREPARE];

    const portProcess = await netstatByPort(port);

    process.kill(portProcess.pid, 'SIGINT');

    return { key: PROCESS_ENUM.DOCTOR_SHUTDOWN };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.DOCTOR_SHUTDOWN} process`, error);

    throw error;
  }
};
