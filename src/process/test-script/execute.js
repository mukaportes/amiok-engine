const { waitFor } = require('../../modules/utils');
const { runSequence } = require('../../modules/http');
const PROCESS_ENUM = require('../../enums/process');
const { isObject, isFunction } = require('../../modules/validate');
const logger = require('../../modules/logger');

const validate = (context) => {
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE]))
    throw new Error('Missing SETTINGS_PREPARE context data');
  if (!isObject(context[PROCESS_ENUM.SETTINGS_PREPARE].config))
    throw new Error('Missing settings config');
  if (!isObject(context[PROCESS_ENUM.STORAGE_PREPARE]))
    throw new Error('Missing STORAGE_PREPARE context data');
  if (!isObject(context[PROCESS_ENUM.STORAGE_PREPARE].storage))
    throw new Error('Missing STORAGE_PREPARE storage module');
  if (!isFunction(context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeTestResults))
    throw new Error('Missing STORAGE_PREPARE storage module storeTestResults()');
  if (!isObject(context[PROCESS_ENUM.SETUP_TEST]))
    throw new Error('Missing TEST_SETUP context data');
  if (!isObject(context[PROCESS_ENUM.SETUP_TEST].test)) throw new Error('Missing TEST_SETUP test');
};

/**
 *
 * @param {Params} _
 * @param {Context} context
 * @returns {TestScriptsExecuteContext}
 */
module.exports = async (_, context = {}) => {
  logger.info(`Executing process ${PROCESS_ENUM.SCRIPT_EXECUTE}`);
  const startTime = new Date().getTime();
  try {
    validate(context);

    const {
      config: { basePath, rounds = 200, threads = 10, testScripts = [], staticDelay },
    } = context[PROCESS_ENUM.SETTINGS_PREPARE];

    if (!basePath) {
      throw new Error(
        'No valid AMIOK scripts basePath provided. Check your amiok.settings.json file'
      );
    }
    if (!Array.isArray(testScripts) || !testScripts.length) {
      throw new Error('No AMIOK test scripts provided. Check your amiok.settings.json file');
    }

    for (let round = 0; round < rounds; round += 1) {
      // eslint-disable-next-line no-await-in-loop
      const roundResults = await Promise.all(
        [...new Array(threads)].map(() =>
          runSequence(
            {
              basePath,
              rounds,
              threads,
              staticDelay,
            },
            testScripts
          )
        )
      );

      context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeTestResults(
        context[PROCESS_ENUM.SETUP_TEST].test.id,
        roundResults
      );
      logger.info(`Executed round ${round} of ${rounds}`);
    }

    const endTime = new Date().getTime();
    await waitFor({ staticDelay });

    return { key: PROCESS_ENUM.SCRIPT_EXECUTE, startTime, endTime };
  } catch (error) {
    logger.error(`Error executing ${PROCESS_ENUM.SCRIPT_EXECUTE} process`, error);

    throw error;
  }
};
