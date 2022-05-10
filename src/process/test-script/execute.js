const { runSequence } = require('../../modules/http');
const PROCESS_ENUM = require('../../enums/process');

const waitAfterExecute = ({ staticDelay = 5000 }) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, staticDelay)
});

module.exports = async (_, context) => {
  console.info(`Executing process ${PROCESS_ENUM.SCRIPT_EXECUTE}`);
  const startTime = new Date().getTime();
  try {
    const { config: {
      basePath,
      // runInSequence = true,
      rounds = 200,
      threads = 10,
      testScripts = [],
      staticDelay,
    } } = context[PROCESS_ENUM.SETTINGS_PREPARE];

    if (!basePath) throw 'No valid AMIOK scripts basePath provided. Check your amiok.settings.json file';
    if (!Array.isArray(testScripts) || !testScripts.length) throw 'No AMIOK test scripts provided. Check your amiok.settings.json file';

    for (let round = 0; round < rounds; round += 1) {
      const roundResults = await Promise.all(
        [...new Array(threads)].map(
          () => runSequence(
            {
              basePath,
              rounds,
              threads,
              staticDelay,
            },
            testScripts,
          )
        )
      );

      await context[PROCESS_ENUM.STORAGE_PREPARE].storage.storeTestResults(
        context[PROCESS_ENUM.STORAGE_TEST_SETUP].id,
        roundResults,
      );
      console.info(`Executed round ${round} of ${rounds}`);
    }

    const endTime = new Date().getTime();
    await waitAfterExecute({ staticDelay });

    return { key: PROCESS_ENUM.SCRIPT_EXECUTE, startTime, endTime };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.SCRIPT_EXECUTE} process`, error);

    throw error;
  }
};