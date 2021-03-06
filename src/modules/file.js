const fs = require('fs/promises');
const logger = require('./logger');

/**
 *
 * @param {string} filePath
 * @returns {object} { type: string, content: string }
 */
const getFileContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');

    return { type: typeof content, content };
  } catch (error) {
    logger.error('Error while reading file', error);
    throw new Error(error);
  }
};

/**
 *
 * @param {string} folderPath
 */
const removeFolder = async (folderPath) => {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
  } catch (error) {
    logger.error('Error while removing folder', error);
    throw new Error(error);
  }
};

/**
 *
 * @param {string} path
 * @returns {boolean}
 */
const pathExists = async (path) => {
  try {
    await fs.access(path, fs.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 *
 * @param {string} fileFolder
 * @param {string} fileName
 */
const createFile = async (fileFolder, fileName) => {
  try {
    const folderExists = await pathExists(fileFolder);
    if (!folderExists) {
      await fs.mkdir(fileFolder);
    }

    await fs.writeFile(`${fileFolder}/${fileName}`, '');
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *
 * @param {string} folderPath
 * @returns {string}
 */
const getFirstFileFromFolder = async (folderPath) => {
  try {
    const files = await fs.readdir(folderPath);

    return files[0];
  } catch (error) {
    logger.error('Error getting first file from folder', error);
    throw new Error(error);
  }
};

module.exports = {
  getFileContent,
  removeFolder,
  pathExists,
  createFile,
  getFirstFileFromFolder,
};
