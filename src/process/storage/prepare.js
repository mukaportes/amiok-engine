const path = require('path');
const { fileExists } = require('../../modules/file');
const storage = require('../../modules/store');
const PROCESS_ENUM = require('../../enums/process');

module.exports = async (_, context) => {
  console.info(`Executing process ${PROCESS_ENUM.STORAGE_PREPARE}`);
  try {
    const defaultStorage = { ...storage };
    let isValidFile = false;
    let configFile = defaultStorage;

    if (context[PROCESS_ENUM.SETTINGS_PREPARE].config.storageModule) {
      const execPath = process.cwd();
      const fromPath = path.join(
        execPath,
        context[PROCESS_ENUM.SETTINGS_PREPARE].config.storageModule
      );
      isValidFile = await fileExists(fromPath);

      if (isValidFile) {
        const externalConfig = require(fromPath);
        configFile = { ...defaultStorage, ...externalConfig };
      }
    }

    return { key: PROCESS_ENUM.STORAGE_PREPARE, storage: configFile };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.STORAGE_PREPARE} process`, error);

    throw error;
  }
};
