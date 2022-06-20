const storeModule = require('../../src/modules/store');
const logger = require('../../src/modules/logger');

jest.mock('../../src/modules/logger', () => ({
  info: jest.fn(),
}));

describe('Store Module Tests', () => {
  describe('storeTest()', () => {
    it('prints args', () => {
      const test = 'someData';

      storeModule.storeTest(test);

      expect(logger.info).toHaveBeenCalledWith('Called storeTest()', { test });
    });
  });
  describe('storeTestResults()', () => {
    it('prints args', () => {
      const id = 'someData';
      const results = ['someData'];

      storeModule.storeTestResults(id, results);

      expect(logger.info).toHaveBeenCalledWith('Called storeTestResults()', { id, results });
    });
  });
  describe('storeResourceStats()', () => {
    it('prints args', () => {
      const id = 'someData';
      const resourceStats = ['someData'];

      storeModule.storeResourceStats(id, resourceStats);

      expect(logger.info).toHaveBeenCalledWith('Called storeResourceStats()', {
        id,
        resourceStats,
      });
    });
  });
  describe('storeReportFile()', () => {
    it('prints args', () => {
      const id = 'someData';
      const reportFile = ['someData'];

      storeModule.storeReportFile(id, reportFile);

      expect(logger.info).toHaveBeenCalledWith('Called storeReportFile()', { id, reportFile });
    });
  });
});
