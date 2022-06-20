const fs = require('fs/promises');
const PROCESS_ENUM = require('../../../src/enums/process');
const setupTest = require('../../../src/process/setup/test');

jest.mock('fs/promises', () => ({
  readdir: jest.fn(
    (folderPath) =>
      new Promise((resolve, reject) => {
        if (folderPath.includes('error')) reject('Force error readdir');
        else resolve(['myfile.stat']);
      })
  ),
}));

describe('Setup Test Process Tests', () => {
  describe('happy path', () => {
    it('should return new context data containing the test id', async () => {
      try {
        const newCtxData = await setupTest();

        expect(newCtxData.key).toBe(PROCESS_ENUM.SETUP_TEST);
        expect(newCtxData.test.id).toBe('myfile');
        expect(global.amiokCurrentTestId).toBe('myfile');
        expect(fs.readdir).toHaveBeenCalledWith(`${process.cwd()}/_amiokstats`);
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw new error when an exception occurs', async () => {
      const stubProcess = jest.spyOn(global.process, 'cwd').mockImplementation(() => '/error');
      try {
        const newCtxData = await setupTest();

        expect(newCtxData.key).toBe(PROCESS_ENUM.SETUP_TEST);
        expect(newCtxData.test.id).toBe('myfile');
        expect(global.amiokCurrentTestId).toBe('myfile');
        expect(fs.readdir).toHaveBeenCalledWith(`${process.cwd()}/_amiokstats`);
      } catch (error) {
        expect(stubProcess).toHaveBeenCalled();
        expect(error).toEqual(new Error('Force error readdir'));
      }
    });
  });
});
