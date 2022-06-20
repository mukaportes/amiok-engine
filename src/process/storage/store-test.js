const PROCESS_ENUM = require('../../enums/process');
const { isObject, isFunction } = require('../../modules/validate');
const logger = require('../../modules/logger');

const validate = (context) => {
  if (!isObject(context[PROCESS_ENUM.SETUP_TEST]))
    throw new Error('Missing TEST_SETUP context data');
  if (!isObject(context[PROCESS_ENUM.SETUP_TEST].test))
    throw new Error('Missing storage test data');
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE]))
    throw new Error('Missing SETTINGS_PREPARE context data');
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE].config))
    throw new Error('Missing settings config');
  if (!isObject(context[PROCESS_ENUM.SCRIPT_EXECUTE]))
    throw new Error('Missing SCRIPT_EXECUTE context data');
  if (!isObject(context[PROCESS_ENUM.STORAGE_PREPARE]))
    throw new Error('Missing STORAGE_PREPARE context data');
  if (!isObject(context[PROCESS_ENUM.STORAGE_PREPARE].storage))
    throw new Error('Missing STORAGE_PREPARE storage module');
  if (!isFunction(context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeTest))
    throw new Error('Missing STORAGE_PREPARE storage module storeTest()');
};

/**
 *
 * @param {Params} _
 * @param {Context} context
 * @returns {NewContextData}
 */
module.exports = async (_, context = {}) => {
  logger.info(`Executing process ${PROCESS_ENUM.STORAGE_TEST_RESULT}`);
  try {
    validate(context);

    const newTestProps = {
      ...context[PROCESS_ENUM.SETUP_TEST].test,
      title: context[PROCESS_ENUM.SETTINGS_PREPARE].config.title,
      basePath: context[PROCESS_ENUM.SETTINGS_PREPARE].config.basePath,
      roundCount: context[PROCESS_ENUM.SETTINGS_PREPARE].config.rounds,
      threadCount: context[PROCESS_ENUM.SETTINGS_PREPARE].config.threads,
      startedAt: context[PROCESS_ENUM.SCRIPT_EXECUTE].startTime,
      endedAt: context[PROCESS_ENUM.SCRIPT_EXECUTE].endTime,
    };

    await context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeTest(newTestProps);

    return { key: PROCESS_ENUM.STORAGE_TEST_RESULT };
  } catch (error) {
    logger.error(`Error executing ${PROCESS_ENUM.STORAGE_TEST_RESULT} process`, error);

    throw error;
  }
};
