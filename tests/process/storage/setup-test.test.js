const PROCESS_ENUM = require('../../../src/enums/process');
const setupTest = require('../../../src/process/storage/setup-test');

describe('Storage Setup Test Process Tests', () => {
  describe('happy path', () => {
    it('should return new context data containing the test id', async () => {
      try {
        const newCtxData = await setupTest();

        expect(newCtxData.key).toBe(PROCESS_ENUM.STORAGE_TEST_SETUP);
        expect(newCtxData.test.id).toBeDefined();
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});