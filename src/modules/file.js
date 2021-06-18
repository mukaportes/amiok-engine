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
    const fullPath = path.join(__dirname, `../../${folderPath}`);

    rimraf(fullPath, (err) => {
      if (err) throw err;

      resolve(`Removed all content from folder at ${fullPath}`);
    });
  } catch (error) {
    console.error('removeFolder() error', error);

    reject(error);
  }
});

module.exports = {
  getFileContent,
  removeFolder,
};
