const path = require('path');
const { pathExists } = require('../../modules/file');
const PROCESS_ENUM = require('../../enums/process');

/**
 *
 * @returns {SettingsPrepareContext}
 */
module.exports = async () => {
  console.info(`Executing process ${PROCESS_ENUM.SETTINGS_PREPARE}`);
  try {
    const execPath = process.cwd();
    const fromPath = path.join(execPath, './amiok.settings.json');
    const isValidFile = await pathExists(fromPath);

    if (!isValidFile) {
      throw new Error('No valid AMIOK scripts provided. Check your amiok.settings.json file');
    }

    // NOTE: need to dynamically require file to grab settings data
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const configFile = require(fromPath);
    configFile.title = configFile.title || 'AMIOK Test';

    return { key: PROCESS_ENUM.SETTINGS_PREPARE, config: configFile };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.SETTINGS_PREPARE} process`, error);

    throw error;
  }
};
