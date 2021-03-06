const PROCESS_ENUM = require('../../enums/process');
const { netstatByPort } = require('../../modules/cmd');
const { isObject, isNumber } = require('../../modules/validate');
const logger = require('../../modules/logger');

const validate = (context) => {
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE]))
    throw new Error('Missing SETTINGS_PREPARE context data');
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE].config))
    throw new Error('Missing settings config');
  if (!isNumber(context[PROCESS_ENUM.SETTINGS_PREPARE].config.port))
    throw new Error('Missing settings config port');
};

/**
 *
 * @param {Params} _
 * @param {Context} context
 * @returns {InfoApiPidContext}
 */
module.exports = async (_, context = {}) => {
  logger.info(`Executing process ${PROCESS_ENUM.INFO_API_PID}`);
  try {
    validate(context);

    const { config } = context[PROCESS_ENUM.SETTINGS_PREPARE];
    const subProcess = await netstatByPort(config.port);

    if (!subProcess) throw new Error('No process running in the port given');

    return { key: PROCESS_ENUM.INFO_API_PID, apiPid: subProcess.pid };
  } catch (error) {
    logger.error(`Error executing ${PROCESS_ENUM.INFO_API_PID} process`, error);

    throw error;
  }
};
