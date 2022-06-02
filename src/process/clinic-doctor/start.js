const PROCESS_ENUM = require('../../enums/process');
const { waitFor } = require('../../modules/utils');
const { execDoctor } = require('../../modules/doctor');

const validate = (params, context) => {
  if (!params.collectCallback) throw new Error('Missing collectCallback method');
  if (!context[PROCESS_ENUM.SETTINGS_PREPARE]) throw new Error('Missing SETTINGS_PREPARE context data');
};

/**
 * 
 * @param {Params} params 
 * @param {Context} context 
 * @returns {NewContextData}
 */
module.exports = async (params, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_START}`);
  try {
    validate(params, context);

    const { entrypointPath = '.', collectCallback } = params;
    const { config = {} } = context[PROCESS_ENUM.SETTINGS_PREPARE];

    await execDoctor(entrypointPath, ({ filePath }) => {
      if (!context[PROCESS_ENUM.DOCTOR_START]) context[PROCESS_ENUM.DOCTOR_START] = { filePath };
      else context[PROCESS_ENUM.DOCTOR_START].filePath = filePath;

      collectCallback(filePath);
    });

    await waitFor(config.staticDelay);

    return { key: PROCESS_ENUM.DOCTOR_START };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.DOCTOR_START} process`, error);

    throw error;
  }
};
