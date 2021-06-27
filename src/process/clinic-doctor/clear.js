const { removeFolder } = require('../../modules/file');
const PROCESS_ENUM = require('../../enums/process');

module.exports = async ({ filePath }, context) => {
  console.info(`Executing process ${PROCESS_ENUM.DOCTOR_CLEAR}; CTX -->`, context);

  try {
    console.log('filePath', filePath);
    let path = filePath || context[PROCESS_ENUM.DOCTOR_START].filePath;
    const [parentFolder] = path.split('/');

    console.log('`${process.cwd}/${parentFolder}`', `${process.cwd()}/${parentFolder}`);
    await removeFolder(`${process.cwd()}/${parentFolder}`);

    // return { key: PROCESS_ENUM.DOCTOR_CLEAR };
    process.kill(process.pid, 0);
  } catch (error) {
    console.error(`Error executing ${PROCESS_ENUM.DOCTOR_CLEAR} process`, error);

    throw error;
  }
};
