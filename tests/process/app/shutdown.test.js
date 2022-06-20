const Chance = require('chance');
const appShutdownProcess = require('../../../src/process/app/shutdown');
const PROCESS_ENUM = require('../../../src/enums/process');

describe('App Shutdown Process', () => {
  const randomData = new Chance();

  describe('happy path', () => {
    it('should return new context data', async () => {
      try {
        const stubProcess = jest.spyOn(global.process, 'kill').mockImplementation(() => { });
        const apiPid = randomData.integer({ min: 1, max: 2000 });
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: {
            apiPid,
          },
        };

        const newCtxData = await appShutdownProcess(undefined, context);

        expect(newCtxData).toHaveProperty('key', PROCESS_ENUM.APP_SHUTDOWN);
        expect(stubProcess).toHaveBeenCalledWith(apiPid, 'SIGINT');
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw an exception when INFO_API_PID context data is invalid', async () => {
      try {
        await appShutdownProcess();
      } catch (error) {
        expect(error.message).toBe('Missing INFO_API_PID context data');
      }
    });
    it('should throw an exception when settings api pid is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: {
            apiPid: randomData.string(),
          }
        };

        await appShutdownProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing API PID');
      }
    });
  });
});