const assert = require('assert');
const axios = require('axios');

const resolveAxiosParams = (globalConfig, itemConfig) => {
  const { params, query, headers, body } = { ...globalConfig, ...itemConfig };

  return { params, query, headers, body };
};

const setSequenceResponseStatus = (sequenceStats, responseStatus) => {
  const stats = { ...sequenceStats };

  if (stats.responseStatus[responseStatus]) {
    stats.responseStatus[responseStatus] += 1;
  } else {
    stats.responseStatus[responseStatus] = 1;
  }

  return stats;
};

const setSequenceResponseAssert = (sequenceStats, responseData, expectedOutput) => {
  const stats = { ...sequenceStats };

  try {
    assert.deepStrictEqual(responseData, expectedOutput);
    stats.assert.pass += 1;
  } catch (error) {
    stats.assert.fail += 1;
  }

  return stats;
};

const runSequence = async (globalConfig, testScripts = []) => {
  let sequenceStats = {
    responseStatus: {},
    logs: [],
    assert: {
      pass: 0,
      fail: 0,
    },
  };
  // let lastExec; -----> use this when implementing the chain use of response data

  for (let i = 0; i < testScripts.length; i += 1) {
    const startTime = new Date().getTime();
    try {
      // eslint-disable-next-line no-await-in-loop
      const { data, status } = await axios({
        url: `${globalConfig.basePath}${testScripts[i].path}`,
        method: testScripts[i].method.toUpperCase(),
        ...resolveAxiosParams(globalConfig, testScripts[i]),
      });

      sequenceStats = setSequenceResponseStatus(sequenceStats, status);
      sequenceStats = setSequenceResponseAssert(sequenceStats, data, testScripts[i].assert);
      sequenceStats.logs.push({
        path: testScripts[i].path,
        startTime,
        endTime: new Date().getTime(),
      });
    } catch (error) {
      console.error(`Error executing ${testScripts[i].method} request`, error);

      if (error.response) {
        sequenceStats = setSequenceResponseStatus(sequenceStats, error.response.status);
        sequenceStats = setSequenceResponseAssert(
          sequenceStats,
          error.response.data,
          testScripts[i].assert
        );
        sequenceStats.logs.push({
          path: testScripts[i].path,
          startTime,
          endTime: new Date().getTime(),
        });
      }
    }
  }

  return sequenceStats;
};

module.exports = {
  runSequence,
};
