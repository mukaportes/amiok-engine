const path = require('path');
const { fileExists } = require('../../modules/file');
const storage = require('../../modules/store');
const PROCESS_ENUM = require('../../enums/process');

module.exports = async () => {
  console.info(`Executing process ${PROCESS_ENUM.STORAGE_PREPARE}`);
  try {
    const defaultStorage = { ...storage };
    let isValidFile = false;

    if (context[PROCESS_ENUM.SCRIPT_PREPARE].config.storageModule) {
      const execPath = process.cwd();
      const fromPath = path.join(execPath, context[PROCESS_ENUM.SCRIPT_PREPARE].config.storageModule);
      isValidFile = await fileExists(fromPath);
    }

    let configFile;
    if (isValidFile) {
      const externalConfig = require(fromPath);
      configFile = { ...defaultStorage, ...externalConfig };
    } else {
      configFile = defaultStorage;
    }

    return { key: PROCESS_ENUM.STORAGE_PREPARE, storage: configFile };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.STORAGE_PREPARE} process`, error);

    throw error;
  }
};