const PROCESS_ENUM = require('../../enums/process');

/**
 * 
 * @param {Params} _ 
 * @param {Context} context 
 * @returns {NewContextData}
 */
module.exports = async (_, context) => {
  console.info(`Executing process ${PROCESS_ENUM.STORAGE_TEST}`);
  try {
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
