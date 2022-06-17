const fullPipeline = require('../../src/pipelines/full');
const appStart = require('../../src/process/app/start');
const appShutdown = require('../../src/process/app/shutdown');
const programShutdown = require('../../src/process/program/shutdown');
const prepareSettings = require('../../src/process/settings/prepare');
const executeTestScripts = require('../../src/process/test-script/execute');
const analyzeStats = require('../../src/process/stats/analyze');
const getInfoApiPid = require('../../src/process/info/api-pid');
const prepareStorage = require('../../src/process/storage/prepare');
const setupTest = require('../../src/process/setup/test');
const storeTest = require('../../src/process/storage/store-test');

jest.mock('../../src/process/app/start', () =>
  jest.fn().mockResolvedValue({ key: 'APP_START' })
);
jest.mock('../../src/process/app/shutdown', () =>
  jest.fn().mockResolvedValue({ key: 'APP_SHUTDOWN' })
);
jest.mock('../../src/process/program/shutdown', () =>
  jest.fn(
    (params) =>
      new Promise((resolve, reject) => {
        if (params.errorSteps) reject('Force exception');
        else resolve({ key: 'PROGRAM_SHUTDOWN' });
      })
  )
);
jest.mock('../../src/process/settings/prepare', () =>
  jest.fn().mockResolvedValue({ key: 'SETTINGS_PREPARE', config: {} })
);
jest.mock('../../src/process/test-script/execute', () =>
  jest.fn().mockResolvedValue({ key: 'SCRIPT_EXECUTE', startTime: 123, endTime: 132 })
);
jest.mock('../../src/process/stats/analyze', () =>
  jest.fn().mockResolvedValue({ key: 'STATS_ANALYZE' })
);
jest.mock('../../src/process/info/api-pid', () =>
  jest.fn().mockResolvedValue({ key: 'INFO_API_PID', apiPid: 123 })
);
jest.mock('../../src/process/info/api-pid', () =>
  jest.fn().mockResolvedValue({ key: 'STORAGE_PREPARE', storage: {} })
);
jest.mock('../../src/process/storage/prepare', () =>
  jest.fn().mockResolvedValue({ key: 'STORAGE_PREPARE' })
);
jest.mock('../../src/process/storage/prepare', () =>
  jest.fn().mockResolvedValue({ key: 'SETUP_TEST' })
);
jest.mock('../../src/process/setup/test', () =>
  jest.fn().mockResolvedValue({ key: 'SETUP_TEST' })
);
jest.mock('../../src/process/storage/store-test', () =>
  jest.fn().mockResolvedValue({ key: 'STORAGE_TEST_RESULT' })
);

describe('Full Pipeline Tests', () => {
  describe('happy path', () => {
    it('executes steps from the full pipeline', async () => {
      try {
        const params = { collectCallback: 'dummyString' };

        await fullPipeline(params);

        expect(prepareSettings).toHaveBeenCalled();
        expect(prepareStorage).toHaveBeenCalled();
        expect(appStart).toHaveBeenCalled();
        expect(setupTest).toHaveBeenCalled();
        expect(getInfoApiPid).toHaveBeenCalled();
        expect(executeTestScripts).toHaveBeenCalled();
        expect(appShutdown).toHaveBeenCalled();
        expect(analyzeStats).toHaveBeenCalled();
        expect(storeTest).toHaveBeenCalled();
        expect(programShutdown).toHaveBeenCalled();
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
  });
});
