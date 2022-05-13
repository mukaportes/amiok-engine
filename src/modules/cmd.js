const netstat = require('node-netstat');
const { execSync } = require('child_process');

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

const netstatByPort = (port) => {
  if (!port) throw new Error('A port must be provided.');

  return new Promise((resolve, reject) => {
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
