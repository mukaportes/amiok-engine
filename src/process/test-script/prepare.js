const path = require('path');
const { fileExists } = require('../../modules/file');
const PROCESS_ENUM = require('../../enums/process');

module.exports = async ({ }) => {
  console.info(`Executing process ${PROCESS_ENUM.SCRIPT_PREPARE}`);
  try {
    const execPath = process.cwd();
    const fromPath = path.join(execPath, './amiok.settings.json');
    const isValidFile = await fileExists(fromPath);

    if (!isValidFile) throw 'No valid AMIOK scripts provided. Check your amiok.settings.json file';

    const configFile = require(fromPath);
    configFile.title = configFile.title || 'AMIOK Test';

    return { key: PROCESS_ENUM.SCRIPT_PREPARE, config: configFile };
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.SCRIPT_PREPARE} process`, error);

    throw error;
  }
};