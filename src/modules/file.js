const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const getFileContent = (filePath) => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', function (err, content) {
    if (err) reject(err);

    resolve({
      type: typeof content,
      content,
    });
  });
});

const removeFolder = (folderPath) => new Promise((resolve, reject) => {
  try {
    rimraf(folderPath, (err) => {
      if (err) throw err;

      console.log(`Removed all content from folder at ${folderPath}`);

      resolve();
    });
  } catch (error) {
    console.error('removeFolder() error', error);

    reject(error);
  }
});

const fileExists = (path) => new Promise((resolve) => {
  fs.access(path, fs.F_OK, (err) => {
    if (err) resolve(false);

    resolve(true);
  });
});

module.exports = {
  getFileContent,
  removeFolder,
  fileExists,
};
