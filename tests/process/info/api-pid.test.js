const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const infoApiPid = require('../../../src/process/info/api-pid');

jest.mock('../../../src/modules/cmd', () => ({
  netstatByPort: jest.fn(
    (port) =>
      new Promise((resolve) => {
        if (port === 404) resolve(false);
        else resolve({ pid: 123 });
      })
  ),
}));

describe('Info API PID Process Tests', () => {
  const randomData = new Chance();

  describe('happy path', () => {
    it('should return new context data containing the API PID', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: { config: { port: 1111 } },
        };
        const newCtxData = await infoApiPid(undefined, context);

        expect(newCtxData).toStrictEqual({ key: PROCESS_ENUM.INFO_API_PID, apiPid: 123 });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('throws new error when no API PID is returned', async () => {
      const stubConsoleError = jest.spyOn(global.console, 'error');
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: { config: { port: 404 } },
        };
        await infoApiPid(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('No process running in the port given'));
        expect(stubConsoleError).toHaveBeenCalled();
      }
    });
    it('throws new error when SETTINGS_PREPARE context data is invalid', async () => {
      try {
        await infoApiPid();
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETTINGS_PREPARE context data'));
      }
    });
    it('throws new error when SETTINGS_PREPARE config is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {},
          },
        };
        await infoApiPid(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing settings config'));
      }
    });
    it('throws new error when SETTINGS_PREPARE port is invalid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              port: randomData.string(),
            },
          },
        };
        await infoApiPid(undefined, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing settings config port'));
      }
    });
  });
});
