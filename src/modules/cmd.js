const netstat = require('node-netstat');

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
