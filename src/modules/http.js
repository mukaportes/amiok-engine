const assert = require('assert');
const axios = require('axios');

const resolveAxiosParams = (globalConfig, itemConfig) => {
  const { params, query, headers, body } = { ...globalConfig, ...itemConfig };

  return { params, query, headers, body };
};

const setSequenceResponseStatus = (sequenceStats, responseStatus) => {
  if (sequenceStats.responseStatus[responseStatus])
    sequenceStats.responseStatus[responseStatus] += 1;
  else sequenceStats.responseStatus[responseStatus] = 1;
};
const setSequenceResponseAssert = (sequenceStats, responseData, expectedOutput) => {
  if (assert.deepStrictEqual(responseData, expectedOutput)) sequenceStats.assert.pass += 1;
  else sequenceStats.assert.fail += 1;
};

const runSequence = async (globalConfig, testScripts = []) => {
  const sequenceStats = {
    responseStatus: {},
    logs: [],
    assert: {
      pass: 0,
      fail: 0,
    },
  };
  // let lastExec; -----> use this when implementing the chain use of response data

  for (let i = 0; i < testScripts.length; i += 1) {
    try {
      const startTime = new Date().getTime();
      const { data, status } = await axios({
        url: `${globalConfig.basePath}${testScripts[i].path}`,
        method: testScripts[i].method.toUpperCase(),
        ...resolveAxiosParams(globalConfig, testScripts[i]),
      });

      if (sequenceStats.responseStatus[status]) sequenceStats.responseStatus[status] += 1;
      else sequenceStats.responseStatus[status] = 1;

      setSequenceResponseStatus(sequenceStats, status);
      setSequenceResponseAssert(sequenceStats, data, testScripts[i].assert);
      sequenceStats.logs.push({
        path: testScripts[i].path,
        startTime,
        endTime: new Date().getTime(),
      });

      lastExec = { data, status };
    } catch (error) {
      console.error(`Error executing ${testScripts[i].method} request`, error);

      if (error.response) {
        setSequenceResponseStatus(sequenceStats, error.response.status);
        setSequenceResponseAssert(sequenceStats, error.response.data, testScripts[i].assert);
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
