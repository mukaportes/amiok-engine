const storeModule = require('../../src/modules/store');

describe('Store Module Tests', () => {
  describe('storeTest()', () => {
    it('prints args', () => {
      const stubConsole = jest.spyOn(global.console, 'log');
      const test = 'someData';

      storeModule.storeTest(test);

      expect(stubConsole).toHaveBeenCalledWith('Called storeTest()', { test });

      stubConsole.mockClear();
    });
  });
  describe('storeTestResults()', () => {
    it('prints args', () => {
      const stubConsole = jest.spyOn(global.console, 'log');
      const id = 'someData';
      const results = ['someData'];

      storeModule.storeTestResults(id, results);

      expect(stubConsole).toHaveBeenCalledWith('Called storeTestResults()', { id, results });

      stubConsole.mockClear();
    });
  });
  describe('storeResourceStats()', () => {
    it('prints args', () => {
      const stubConsole = jest.spyOn(global.console, 'log');
      const resourceStats = ['someData'];

      storeModule.storeResourceStats(resourceStats);

      expect(stubConsole).toHaveBeenCalledWith('Called storeResourceStats()', { resourceStats });

      stubConsole.mockClear();
    });
  });
  describe('storeReportFile()', () => {
    it('prints args', () => {
      const stubConsole = jest.spyOn(global.console, 'log');
      const reportFile = ['someData'];

      storeModule.storeReportFile(reportFile);

      expect(stubConsole).toHaveBeenCalledWith('Called storeReportFile()', { reportFile });

      stubConsole.mockClear();
    });
  });
});