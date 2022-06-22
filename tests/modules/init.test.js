const initModule = require('../../src/modules/init');
const { createFile } = require('../../src/modules/file');
const { addStatsToFile, getReportFilePath, setCurrentTestId } = require('../../src/modules/stats');
const { waitFor } = require('../../src/modules/utils');

jest.mock('os', () => ({
  cpus: jest.fn(() => [
    {
      times: {
        time1: 10,
        time2: 10,
        time3: 10,
        time4: 10,
        idle: 10,
      },
    },
    {
      times: {
        time1: 10,
        time2: 10,
        time3: 10,
        time4: 10,
        idle: 10,
      },
    },
  ]),
}));

jest.mock('../../src/modules/file', () => ({
  createFile: jest.fn().mockResolvedValue(),
}));
jest.mock('../../src/modules/stats', () => ({
  getReportFilePath: jest.fn(() => ({ fileFolder: '/path', fileName: 'undefined.js' })),
  addStatsToFile: jest.fn(),
  setCurrentTestId: jest.fn(),
  addStatsToFile: jest.fn(),
}));

describe('Init Module Tests', () => {
  describe('getCpuPercentage()', () => {
    describe('happy path', () => {
      it.only('returns cpu usage percentage', async () => {
        try {
          const cpuUsage = initModule.getCpuPercentage();

          expect(cpuUsage).toBe(80);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
  });
  describe('startAmiok()', () => {
    describe('happy path', () => {
      it.only('executes amiok start process', async () => {
        try {
          await initModule.startAmiok();

          await waitFor(3000);
          initModule.stopAmiok();

          expect(createFile).toHaveBeenCalled();
          expect(addStatsToFile).toHaveBeenCalled();
          expect(getReportFilePath).toHaveBeenCalled();
          expect(setCurrentTestId).toHaveBeenCalled();
        } catch (error) {
          throw new Error(error);
        }
      });
    });
  });
});
