const fs = require('fs/promises');
const { createReadStream } = require('fs');
const readline = require('readline');
const Stream = require('stream');

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
    console.error('Error while reading file', error);
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
    console.error('Error while removing folder', error);
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
    console.error('Error while verifying if file exists', error);
    return false;
  }
};

const createFile = async (fileFolder, fileName) => {
  try {
    const folderExists = await pathExists(fileFolder);
    console.log('\n\nfolderExists', folderExists);
    console.log('\n\nfileFolder', fileFolder);
    console.log('\n\nfileName', fileName);
    if (!folderExists) {
      await fs.mkdir(fileFolder);
    }

    await fs.writeFile(`${fileFolder}/${fileName}`, '');
  } catch (error) {
    throw new Error(error);
  }
};

const readFileLines = (filePath, processLineFn, statsTemplate) =>
  new Promise((resolve, reject) => {
    try {
      let results = statsTemplate;
      const inputStream = createReadStream(filePath);
      const outputStream = new Stream();
      const rlInterface = readline.createInterface(inputStream, outputStream);

      rlInterface.on('line', (lineData) => {
        console.log('lineData', lineData);
        results = processLineFn(results, lineData);
      });

      rlInterface.on('close', () => resolve(results));
    } catch (error) {
      console.error('Error while reading report file', error);

      reject(new Error(error));
    }
  });

const getFirstFileFromFolder = async (folderPath) => {
  try {
    const files = await fs.readdir(folderPath);

    return files[0];
  } catch (error) {
    console.error('Error getting first file from folder', error);
    throw new Error(error);
  }
};

module.exports = {
  getFileContent,
  removeFolder,
  pathExists,
  createFile,
  readFileLines,
  getFirstFileFromFolder,
};
