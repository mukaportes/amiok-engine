const { spawn } = require('child_process');
const PROCESS_ENUM = require('../../enums/process');
const { getReportFilePath } = require('../../modules/stats');
const { waitFor } = require('../../modules/utils');

const validate = (params, context) => {
  if (!context[PROCESS_ENUM.SETTINGS_PREPARE])
    throw new Error('Missing SETTINGS_PREPARE context data');
  if (!context[PROCESS_ENUM.SETTINGS_PREPARE].config)
    throw new Error('Missing SETTINGS_PREPARE config');
  if (!context[PROCESS_ENUM.SETTINGS_PREPARE].config.initApp)
    throw new Error('Missing SETTINGS_PREPARE config init app');
};

/**
 *
 * @param {Params} params
 * @param {Context} context
 * @returns {NewContextData}
 */
module.exports = async (params = {}, context = {}) => {
  console.info(`Executing process ${PROCESS_ENUM.APP_START}`);
  try {
    validate(params, context);

    const { config = {} } = context[PROCESS_ENUM.SETTINGS_PREPARE];
    console.log('\n\ngetReportFilePath()', getReportFilePath());

    const [firstArg, ...restArgs] = config.initApp.split(' ');
    spawn(firstArg, restArgs, { stdio: 'inherit' });

    await waitFor(config.staticDelay);

    return { key: PROCESS_ENUM.APP_START };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.APP_START} process`, error);

    throw error;
  }
};
