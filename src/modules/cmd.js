const path = require('path');
// const util = require('util');
const { execSync } = require('child_process');


const execCmd = async (cmd, fromPath) => {
  try {
    execSync(cmd, {
      stdio: [0, 1, 2], // we need this so node will print the command output
      // cwd: path.resolve(fromPath, ''), // path to where you want to save the file
    });
  } catch (error) {
    throw new Error(error);
  }
}

const execCmdList = async (cmdList = [], fromPath) => {
  if (!fromPath) throw new Error('Origin path must be provided.');

  for (let i = 0; i < cmdList.length; i += 1) {
    console.log('Executing: ', cmdList[i]);

    await execCmd(cmdList[i], fromPath);
  }

  console.log('Done executing cmd list from path', fromPath);
};

module.exports = {
  execCmd,
  execCmdList,
};