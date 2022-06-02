const PROCESS_ENUM = require('../../enums/process');

const validate = (context) => {
  if (!context[PROCESS_ENUM.STORAGE_TEST_SETUP]) throw new Error('Missing STORAGE_TEST_SETUP context data');
  if (!context[PROCESS_ENUM.STORAGE_TEST_SETUP].test) throw new Error('Missing storage test data');
  if (!context[PROCESS_ENUM.SETTINGS_PREPARE]) throw new Error('Missing SETTINGS_PREPARE context data');
  if (!context[PROCESS_ENUM.SETTINGS_PREPARE].config) throw new Error('Missing settings config');
  if (!context[PROCESS_ENUM.SCRIPT_EXECUTE]) throw new Error('Missing SCRIPT_EXECUTE context data');
  if (!context[PROCESS_ENUM.STORAGE_PREPARE]) throw new Error('Missing STORAGE_PREPARE context data');
  if (!context[PROCESS_ENUM.STORAGE_PREPARE].storage) throw new Error('Missing STORAGE_PREPARE storage module');
  if (!context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeTest) throw new Error('Missing STORAGE_PREPARE storage module storeTest()');
};

/**
 * 
 * @param {Params} _ 
 * @param {Context} context 
 * @returns {NewContextData}
 */
module.exports = async (_, context = {}) => {
  console.info(`Executing process ${PROCESS_ENUM.STORAGE_TEST}`);
  try {
    validate(context);

    const newTestProps = {
      ...context[PROCESS_ENUM.STORAGE_TEST_SETUP].test,
      title: context[PROCESS_ENUM.SETTINGS_PREPARE].config.title,
      basePath: context[PROCESS_ENUM.SETTINGS_PREPARE].config.basePath,
      roundCount: context[PROCESS_ENUM.SETTINGS_PREPARE].config.rounds,
      threadCount: context[PROCESS_ENUM.SETTINGS_PREPARE].config.threads,
      startedAt: context[PROCESS_ENUM.SCRIPT_EXECUTE].startTime,
      endedAt: context[PROCESS_ENUM.SCRIPT_EXECUTE].endTime,
    };

    await context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeTest(newTestProps);

    return { key: PROCESS_ENUM.STORAGE_TEST };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.STORAGE_TEST} process`, error);

    throw error;
  }
};
