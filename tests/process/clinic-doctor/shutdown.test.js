const Chance = require('chance');
const PROCESS_ENUM = require('../../../src/enums/process');
const clinicDoctorShutdown = require('../../../src/process/clinic-doctor/shutdown');

describe('Clinic Doctor Shutdown Tests', () => {
  const randomData = new Chance();
  describe('happy path', () => {
    it('should kill API process with SIGINT and return new context data', async () => {
      try {
        const stubProcessKill = jest.spyOn(process, 'kill').mockImplementation(() => { });
        const apiPid = randomData.integer();
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: {
            apiPid,
          },
        };

        const newCtxData = await clinicDoctorShutdown(undefined, context);

        expect(stubProcessKill).toHaveBeenCalledWith(apiPid, 'SIGINT');
        expect(newCtxData).toStrictEqual({ key: PROCESS_ENUM.DOCTOR_SHUTDOWN });
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('throws error when context is missing INFO_API_PID data', async () => {
      try {
        await clinicDoctorShutdown();
      } catch (error) {
        expect(error).toEqual(new Error('Missing INFO_API_PID context data'));
      }
    });
    it('throws error when context is missing INFO_API_PID apiPid', async () => {
      try {
        const context = {
          [PROCESS_ENUM.INFO_API_PID]: {},
        };
        await clinicDoctorShutdown(undefined, context);
      } catch (error) {
        expect(error).toEqual(new Error('Missing API PID'));
      }
    });
  });
});