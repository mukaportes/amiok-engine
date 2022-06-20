const logger = require('./logger');

module.exports = {
  /**
   *
   * @param {TestDB} test
   */
  storeTest: (test) => {
    logger.info('Called storeTest()', { test });
  },
  /**
   *
   * @param {number} id
   * @param {Array<SequenceStats>} results
   */
  storeTestResults: (id, results) => {
    logger.info('Called storeTestResults()', { id, results });
  },
  /**
   *
   * @param {number} id
   * @param {Array<StatsTemplateDb>} resourceStats
   */
  storeResourceStats: (id, resourceStats) => {
    logger.info('Called storeResourceStats()', { id, resourceStats });
  },
  /**
   *
   * @param {number} id
   * @param {string} reportFile
   */
  storeReportFile: (id, reportFile) => {
    logger.info('Called storeReportFile()', { id, reportFile });
  },
};
