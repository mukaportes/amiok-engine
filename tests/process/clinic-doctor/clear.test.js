const fs = require('fs/promises');
const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const clinicDoctorClear = require('../../../src/process/clinic-doctor/clear');

jest.mock('fs/promises', () => ({
  rm: jest.fn().mockResolvedValue(true),
}));

describe('Clinic Doctor Clear Process', () => {
  const mockData = new Chance();
  describe('happy path', () => {
    it('should kill process with code 0 using params filepath', async () => {
      try {
        const parentFolder = 'path';
        const params = { filePath: `${parentFolder}/${mockData.string()}` };
        const context = {};
        const stubProcessKill = jest.spyOn(process, 'kill').mockImplementation(() => { });

        await clinicDoctorClear(params, context);

        expect(fs.rm).toHaveBeenCalledWith(
          `${process.cwd()}/${parentFolder}`,
          { recursive: true, force: true },
        );
        expect(stubProcessKill).toHaveBeenCalledWith(process.pid, 0);
      } catch (error) {
        throw new Error(error);
      }
    });
    it('should kill process with code 0 using context filepath when not included in params', async () => {
      try {
        const parentFolder = 'path';
        const params = {};
        const context = {
          [PROCESS_ENUM.DOCTOR_START]: {
            filePath: `${parentFolder}/${mockData.string()}`,
          },
        };
        const stubProcessKill = jest.spyOn(process, 'kill').mockImplementation(() => { });

        await clinicDoctorClear(params, context);

        expect(fs.rm).toHaveBeenCalledWith(
          `${process.cwd()}/${parentFolder}`,
          { recursive: true, force: true },
        );
        expect(stubProcessKill).toHaveBeenCalledWith(process.pid, 0);
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('should throw an error if an exception occurs', async () => {
      const stubConsoleError = jest.spyOn(global.console, 'error');
      try {
        const parentFolder = 'path';
        const params = {};
        const context = {};

        await clinicDoctorClear(params, context);
      } catch (error) {
        expect(stubConsoleError).toHaveBeenCalled();
      }
    });
  });
});