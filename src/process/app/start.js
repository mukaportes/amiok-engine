const { spawn } = require('child_process');
const PROCESS_ENUM = require('../../enums/process');
const { waitFor } = require('../../modules/utils');
const { isObject, isString } = require('../../modules/validate');

const validate = (context) => {
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE]))
    throw new Error('Missing SETTINGS_PREPARE context data');
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE].config))
    throw new Error('Missing SETTINGS_PREPARE config');
  if (!isString(context[PROCESS_ENUM.SETTINGS_PREPARE].config.initApp))
    throw new Error('Missing SETTINGS_PREPARE config init app');
};

/**
 *
 * @param {Params} params
 * @param {Context} context
 * @returns {NewContextData}
 */
module.exports = async (_, context = {}) => {
  console.info(`Executing process ${PROCESS_ENUM.APP_START}`);
  try {
    validate(context);

    const { config } = context[PROCESS_ENUM.SETTINGS_PREPARE];

    const [firstArg, ...restArgs] = config.initApp.split(' ');
    spawn(firstArg, restArgs, { stdio: 'inherit' });

    await waitFor(config.staticDelay);

    return { key: PROCESS_ENUM.APP_START };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.APP_START} process`, error);

    throw error;
  }
};
