const fs = require('fs/promises');

const getFileContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');

    return { type: typeof content, content };
  } catch (error) {
    console.error('Error while reading file', error);
    throw new Error(error);
  }
};

const removeFolder = async (folderPath) => {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
  } catch (error) {
    console.error('Error while removing folder', error);
    throw new Error(error);
  }
};

const fileExists = async (path) => {
  try {
    await fs.access(path, fs.F_OK);
    return true;
  } catch (error) {
    console.error('Error while verifying if file exists', error);
    return false;
  }
};

module.exports = {
  getFileContent,
  removeFolder,
  fileExists,
};
