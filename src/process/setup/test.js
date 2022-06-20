const PROCESS_ENUM = require('../../enums/process');
const { getFirstFileFromFolder } = require('../../modules/file');
const { setCurrentTestId } = require('../../modules/stats');
const logger = require('../../modules/logger');

/**
 *
 * @returns {StorageSetupTestContext}
 */
module.exports = async () => {
  try {
    logger.info(`Executing process ${PROCESS_ENUM.SETUP_TEST}`);

    // get file from _amiok folder
    const fileName = await getFirstFileFromFolder(`${process.cwd()}/_amiokstats`);
    const [id] = fileName.split('.stat');
    const test = { id };

    setCurrentTestId(id);

    return { key: PROCESS_ENUM.SETUP_TEST, test };
  } catch (error) {
    logger.error(`Error executing ${PROCESS_ENUM.SETUP_TEST} process`, error);

    throw error;
  }
};
