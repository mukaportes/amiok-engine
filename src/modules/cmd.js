const netstat = require('node-netstat');
const { execSync } = require('child_process');

/**
 * 
 * @param {string} cmd Command to be executed 
 */
const execCmd = (cmd) => {
  try {
    if (!cmd) throw new Error('A command must be provided.');
    execSync(cmd, {
      stdio: [0, 1, 2], // print the command output
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 
 * @param {number} port Port to be searched 
 * @returns {Promise} { port: number } when resolved
 */
const netstatByPort = (port) => {
  return new Promise((resolve, reject) => {
    if (!port) reject('A port must be provided.');
    netstat(
      {
        filter: {
          local: { port },
        },
      },
      (item, err) => {
        if (err) reject(err);
        resolve(item);
      }
    );
  });
};

module.exports = {
  execCmd,
  netstatByPort,
};
