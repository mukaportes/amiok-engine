module.exports = {
  /**
   * 
   * @param {TestDB} test 
   */
  storeTest: (test) => {
    console.log('Called storeTest()', { test });
  },
  /**
   * 
   * @param {number} id 
   * @param {Array<SequenceStats>} results 
   */
  storeTestResults: (id, results) => {
    console.log('Called storeTestResults()', { id, results });
  },
  /**
   * 
   * @param {number} id 
   * @param {Array<StatsTemplateDb>} resourceStats 
   */
  storeResourceStats: (id, resourceStats) => {
    console.log('Called storeResourceStats()', { id, resourceStats });
  },
  /**
   * 
   * @param {number} id 
   * @param {string} reportFile 
   */
  storeReportFile: (id, reportFile) => {
    console.log('Called storeReportFile()', { id, reportFile });
  },
};
