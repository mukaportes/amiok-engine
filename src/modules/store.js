module.exports = {
  storeTest: (test) => {
    console.log('Called storeTest()', { test });
  },
  storeTestResults: (id, results) => {
    console.log('Called storeTestResults()', { id, results });
  },
  storeResourceStats: (resourceStats) => {
    console.log('Called storeResourceStats()', { resourceStats });
  },
  storeReportFile: (reportFile) => {
    console.log('Called storeReportFile()', { reportFile });
  },
};