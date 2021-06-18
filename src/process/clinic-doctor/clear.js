const { removeFolder } = require('../../modules/file');
const PROCESS_ENUM = require('../../enums/process');

module.exports = async (_, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_CLEAR}; CTX -->`, context);

  try {
    const { filePath } = context[PROCESS_ENUM.DOCTOR_START];
    const [parentFolder] = filePath.split('/');

    await removeFolder(parentFolder);

    return { key: PROCESS_ENUM.DOCTOR_CLEAR };
  } catch (error) {
    console.error('error executing start server process', error);

    throw error;
  }
};
