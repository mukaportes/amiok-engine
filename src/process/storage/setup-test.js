const crypto = require('crypto');
const PROCESS_ENUM = require('../../enums/process');

module.exports = async () => {
  console.info(`Executing process ${PROCESS_ENUM.STORAGE_TEST_SETUP}`);
  try {
    const test = {
      id: crypto.randomUUID(),
    };

    return { key: PROCESS_ENUM.STORAGE_TEST_SETUP, test };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.STORAGE_TEST_SETUP} process`, error);

    throw error;
  }
};