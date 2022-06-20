const PROCESS_ENUM = require('../../../src/enums/process');
const settingsPrepare = require('../../../src/process/settings/prepare');
const mockConfig = require('../../mocks/amiok.settings.json');

jest.mock('fs/promises', () => ({
  access: jest.fn(
    (path) =>
      new Promise((resolve, reject) => {
        if (path.includes('/path/error')) {
          reject();
        } else {
          resolve();
        }
      })
  ),
}));

describe('Settings Prepare Process Tests', () => {
  describe('happy path', () => {
    it('should return new context data containing the loaded config', async () => {
      const stubCwd = jest.spyOn(process, 'cwd').mockImplementation(() => '../../../tests/mocks/');
      try {
        const newCtxData = await settingsPrepare();

        expect(stubCwd).toHaveBeenCalled();
        expect(newCtxData).toStrictEqual({
          key: PROCESS_ENUM.SETTINGS_PREPARE,
          config: { title: mockConfig.title },
        });
      } catch (error) {
        throw new Error(error);
      }
    });
    it('should return new context data containing the loaded config with the default title', async () => {
      const stubCwd = jest
        .spyOn(process, 'cwd')
        .mockImplementation(() => '../../../tests/mocks/error/'); // path from /src/process/settings/prepare.js
      try {
        const newCtxData = await settingsPrepare();

        expect(stubCwd).toHaveBeenCalled();
        expect(newCtxData).toStrictEqual({
          key: PROCESS_ENUM.SETTINGS_PREPARE,
          config: { title: 'AMIOK Test' },
        });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw an error when config file does not exist', async () => {
      const stubCwd = jest.spyOn(process, 'cwd').mockImplementation(() => '/path/error');
      try {
        await settingsPrepare();
      } catch (error) {
        expect(stubCwd).toHaveBeenCalled();
        expect(error).toEqual(
          new Error('No valid AMIOK scripts provided. Check your amiok.settings.json file')
        );
      }
    });
  });
});
