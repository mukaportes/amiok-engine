const { removeFolder } = require('../../modules/file');
const PROCESS_ENUM = require('../../enums/process');

const validate = (params, context) => {
  if (!params.filePath) {
    if (!context[PROCESS_ENUM.DOCTOR_START]) throw new Error('Missing DOCTOR_START context data');
    if (!context[PROCESS_ENUM.DOCTOR_START].filePath) throw new Error('Missing Doctor filePath');
  }
};


/**
 * 
 * @param {Params} params
 * @param {Context} context 
 */
module.exports = async (params, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_CLEAR}`);

  try {
    validate(params, context);

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
