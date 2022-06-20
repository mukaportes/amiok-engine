const PROCESS_ENUM = require('../../enums/process');
const { removeFolder, getFileContent } = require('../../modules/file');
const { getReportFilePath } = require('../../modules/stats');
const { isObject, isBoolean, isFunction } = require('../../modules/validate');
const logger = require('../../modules/logger');

const validate = (context) => {
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE]))
    throw new Error('Missing SETTINGS_PREPARE context data');
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE].config))
    throw new Error('Missing SETTINGS_PREPARE config');

  if (isBoolean(context[PROCESS_ENUM.SETTINGS_PREPARE].config.persistReports)) {
    if (!isObject(context[PROCESS_ENUM.SETUP_TEST]))
      throw new Error('Missing SETUP_TEST context data');
    if (!isObject(context[PROCESS_ENUM.SETUP_TEST].test))
      throw new Error('Missing SETUP_TEST test data');
    if (!isObject(context[PROCESS_ENUM.STORAGE_PREPARE]))
      throw new Error('Missing STORAGE_PREPARE context data');
    if (!isObject(context[PROCESS_ENUM.STORAGE_PREPARE].storage))
      throw new Error('Missing STORAGE_PREPARE storage module');
    if (!isFunction(context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeReportFile))
      throw new Error('Missing STORAGE_PREPARE storage module store reports file method');
  }
};

/**
 *
 * @param {Params} _
 * @param {Context} context
 * @returns {NewContextData}
 */
module.exports = async (_, context = {}) => {
  logger.info(`Executing process ${PROCESS_ENUM.PROGRAM_SHUTDOWN}`);
  try {
    validate(context);
    const { config } = context[PROCESS_ENUM.SETTINGS_PREPARE];

    if (config.persistReports) {
      const reportFile = await getFileContent(getReportFilePath().path);
      const { id } = context[PROCESS_ENUM.SETUP_TEST].test;
      await context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeReportFile(id, reportFile.content);
    }

    await removeFolder(`${process.cwd()}/_amiokstats`);

    process.kill(process.pid, 0);

    return { key: PROCESS_ENUM.PROGRAM_SHUTDOWN };
  } catch (error) {
    logger.error(`Error executing ${PROCESS_ENUM.PROGRAM_SHUTDOWN} process`, error);

    throw error;
  }
};
