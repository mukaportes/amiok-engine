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
    it('should throw an error filePath is not provided with missing DOCTOR_START context data', async () => {
      try {
        const params = {};
        const context = {};

        await clinicDoctorClear(params, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing DOCTOR_START context data'));
      }
    });
    it('should throw an error filePath is not provided with missing DOCTOR_START filePath', async () => {
      try {
        const params = {};
        const context = {
          [PROCESS_ENUM.DOCTOR_START]: {},
        };

        await clinicDoctorClear(params, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing Doctor filePath'));
      }
    });
  });
});