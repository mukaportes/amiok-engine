const { removeFolder } = require('../../modules/file');
const PROCESS_ENUM = require('../../enums/process');

/**
 * 
 * @param {Params} params
 * @param {Context} context 
 */
module.exports = async (params, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_CLEAR}`);

  try {
    const path = params.filePath || context[PROCESS_ENUM.DOCTOR_START].filePath;
    const [parentFolder] = path.split('/');
    const folderName = `${process.cwd()}/${parentFolder}`;

    await removeFolder(folderName);

    process.kill(process.pid, 0);
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.DOCTOR_CLEAR} process`, error);

    throw error;
  }
};
