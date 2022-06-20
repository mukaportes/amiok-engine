const PROCESS_ENUM = require('../../enums/process');
const { waitFor } = require('../../modules/utils');
const logger = require('../../modules/logger');
const { isObject, isNumber } = require('../../modules/validate');

const validate = (context) => {
  if (!isObject(context[PROCESS_ENUM.INFO_API_PID]))
    throw new Error('Missing INFO_API_PID context data');
  if (!isNumber(context[PROCESS_ENUM.INFO_API_PID].apiPid)) throw new Error('Missing API PID');
};

/**
 *
 * @param {Params} _
 * @param {Context} context
 * @returns {NewContextData}
 */
module.exports = async (_, context = {}) => {
  logger.info(`Executing process ${PROCESS_ENUM.APP_SHUTDOWN}`);
  try {
    validate(context);
    const { apiPid } = context[PROCESS_ENUM.INFO_API_PID];

    await waitFor(2000);

    process.kill(apiPid, 'SIGINT');

    return { key: PROCESS_ENUM.APP_SHUTDOWN };
  } catch (error) {
    logger.error(`Error executing ${PROCESS_ENUM.APP_SHUTDOWN} process`, error);

    throw error;
  }
};
