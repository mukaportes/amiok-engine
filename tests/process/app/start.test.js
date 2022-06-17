const { spawn } = require('child_process');
const Chance = require('chance');
const appStartProcess = require('../../../src/process/app/start');
const PROCESS_ENUM = require('../../../src/enums/process');

jest.mock('child_process', () => ({
  spawn: jest.fn(),
}));

describe('App Start Process', () => {
  const randomData = new Chance();

  describe('happy path', () => {
    it('should return new context data containing the app cofiguration', async () => {
      try {
        const arg1 = randomData.string();
        const arg2 = randomData.string();
        const arg3 = randomData.string();
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {
              initApp: [arg1, arg2, arg3].join(' '),
            },
          },
        };

        const newCtxData = await appStartProcess(undefined, context);

        expect(newCtxData).toHaveProperty('key', PROCESS_ENUM.APP_START);
        expect(spawn).toHaveBeenCalledWith(arg1, [arg2, arg3], { stdio: 'inherit' });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw an exception when no SETTINGS_PREPARE context data is found', async () => {
      try {
        await appStartProcess();
      } catch (error) {
        expect(error.message).toBe('Missing SETTINGS_PREPARE context data');
      }
    });
    it('should throw an exception when no settings config is found', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {}
        };

        await appStartProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing SETTINGS_PREPARE config');
      }
    });
    it('should throw an exception when no init app is found on the settings config', async () => {
      try {
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: {}
          },
        };
        await appStartProcess(undefined, context);
      } catch (error) {
        expect(error.message).toBe('Missing SETTINGS_PREPARE config init app');
      }
    });
  });
});