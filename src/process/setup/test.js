const crypto = require('crypto');
const PROCESS_ENUM = require('../../enums/process');

/**
 * 
 * @returns {StorageSetupTestContext}
 */
module.exports = async () => {
  console.info(`Executing process ${PROCESS_ENUM.TEST_SETUP}`);

  const test = {
    id: crypto.randomUUID(),
  };

  return { key: PROCESS_ENUM.TEST_SETUP, test };
};
