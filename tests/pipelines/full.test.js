const fullPipeline = require('../../src/pipelines/full');
const startDoctor = require('../../src/process/clinic-doctor/start');
const prepareSettings = require('../../src/process/settings/prepare');
const executeTestScripts = require('../../src/process/test-script/execute');
const analyzeStats = require('../../src/process/stats/analyze');
const clearDoctor = require('../../src/process/clinic-doctor/clear');
const shutdownDoctor = require('../../src/process/clinic-doctor/shutdown');
const getInfoApiPid = require('../../src/process/info/api-pid');
const prepareStorage = require('../../src/process/storage/prepare');
const setupTest = require('../../src/process/storage/setup-test');
const storeTest = require('../../src/process/storage/store-test');

jest.mock('../../src/process/clinic-doctor/start', () => jest.fn()
  .mockResolvedValue({ key: 'DOCTOR_START', val: 1 }));
jest.mock('../../src/process/settings/prepare', () => jest.fn()
  .mockResolvedValue({ key: 'SETTINGS_PREPARE', val: 1 }));
jest.mock('../../src/process/test-script/execute', () => jest.fn()
  .mockResolvedValue({ key: 'SCRIPT_EXECUTE', val: 1 }));
jest.mock('../../src/process/stats/analyze', () => jest
  .fn((params) => new Promise((resolve, reject) => {
    if (params.errorCollectCallback) reject('Force collectCallback exception');
    else resolve({ key: 'STATS_ANALYZE', test: { id: 1 } });
  })));
jest.mock('../../src/process/clinic-doctor/clear', () => jest.fn()
  .mockResolvedValue({ key: 'DOCTOR_CLEAR', val: 1 }));
jest.mock('../../src/process/clinic-doctor/shutdown', () => jest.fn(async (params) => {
  try {
    await params.collectCallback('path/file.js');
    return { key: 'DOCTOR_SHUTDOWN', val: 1 };
  } catch (error) {
    throw new Error(error);
  }
}));
jest.mock('../../src/process/info/api-pid', () => jest.fn()
  .mockResolvedValue({ key: 'INFO_API_PID', val: 1 }));
jest.mock('../../src/process/storage/prepare', () => jest.fn()
  .mockResolvedValue({ key: 'STORAGE_PREPARE', storage: { storeResourceStats: () => jest.fn() } }));
jest.mock('../../src/process/storage/setup-test', () => jest
  .fn((params) => new Promise((resolve, reject) => {
    if (params.errorSteps) reject('Force exception');
    else resolve({ key: 'STORAGE_TEST_SETUP', test: { id: 1 } });
  })));
jest.mock('../../src/process/storage/store-test', () => jest.fn()
  .mockResolvedValue({ key: 'STORAGE_TEST', val: 1 }));

describe('Full Pipeline Tests', () => {
  describe('happy path', () => {
    it('executes steps from the full pipeline', async () => {
      try {
        const params = { collectCallback: 'dummyString' };

        await fullPipeline(params);

        expect(startDoctor).toHaveBeenCalled();
        expect(prepareSettings).toHaveBeenCalled();
        expect(executeTestScripts).toHaveBeenCalled();
        expect(analyzeStats).toHaveBeenCalled();
        expect(clearDoctor).toHaveBeenCalled();
        expect(shutdownDoctor).toHaveBeenCalled();
        expect(getInfoApiPid).toHaveBeenCalled();
        expect(prepareStorage).toHaveBeenCalled();
        expect(setupTest).toHaveBeenCalled();
        expect(storeTest).toHaveBeenCalled();
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('prints error and kills process when an error occurs executing a step', async () => {
      const stubConsole = jest.spyOn(global.console, 'error');
      const stubProcess = jest.spyOn(global.process, 'kill').mockImplementation(() => { });
      try {
        await fullPipeline({ errorSteps: true });
      } catch (error) {
        expect(stubConsole).toHaveBeenCalled();
        expect(stubProcess).toHaveBeenCalledWith(process.pid, 1);
      }
    });
    it('prints error and kills process when an error occurs executing collect callback', async () => {
      const stubConsole = jest.spyOn(global.console, 'error');
      const stubProcess = jest.spyOn(global.process, 'kill').mockImplementation(() => { });
      try {
        await fullPipeline({ errorCollectCallback: true });
      } catch (error) {
        expect(stubConsole).toHaveBeenCalled();
        expect(stubProcess).toHaveBeenCalledWith(process.pid, 1);
      }
    });
  });
});
