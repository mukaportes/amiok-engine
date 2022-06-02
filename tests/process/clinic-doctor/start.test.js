const PROCESS_ENUM = require('../../../src/enums/process');
const clinicDoctorStart = require('../../../src/process/clinic-doctor/start');

jest.mock('../../../src/modules/doctor', () => ({
  execDoctor: jest.fn((_, cb) => cb({ filePath: '/path/file.js' })),
}));

describe('Clinic Doctor Start Tests', () => {
  describe('happy path', () => {
    it('should add filePath to context, call collect callback and return new context data', async () => {
      try {
        const params = {
          collectCallback: jest.fn(),
        };
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {},
        };

        const newCtxData = await clinicDoctorStart(params, context);

        expect(params.collectCallback).toHaveBeenCalledWith('/path/file.js');
        expect(newCtxData).toStrictEqual({ key: PROCESS_ENUM.DOCTOR_START });
      } catch (error) {
        throw new Error(error);
      }
    });
    it('should replace ctx filePath, call collect callback and return new context data', async () => {
      try {
        const filePath = './some/path';
        const params = {
          entrypointPath: './',
          collectCallback: jest.fn(),
        };
        const context = {
          [PROCESS_ENUM.SETTINGS_PREPARE]: {
            config: { staticDelay: 100 },
          },
          [PROCESS_ENUM.DOCTOR_START]: { filePath },
        };

        const newCtxData = await clinicDoctorStart(params, context);

        expect(params.collectCallback).toHaveBeenCalledWith('/path/file.js');
        expect(newCtxData).toStrictEqual({ key: PROCESS_ENUM.DOCTOR_START });
        expect(context[PROCESS_ENUM.DOCTOR_START].filePath).not.toBe(filePath);
      } catch (error) {
        throw new Error(error);
      }
    });
  });
  describe('unhappy path', () => {
    it('throws error when no collectCallback params is provided', async () => {
      try {
        const params = {};
        const context = {};
        await clinicDoctorStart({}, {});
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing collectCallback method'));
      }
    });
    it('throws error when SETTINGS_PREPARE context data is missing', async () => {
      try {
        const params = { collectCallback: () => { } };
        const context = {};
        await clinicDoctorStart(params, context);
      } catch (error) {
        expect(error).toStrictEqual(new Error('Missing SETTINGS_PREPARE context data'));
      }
    });
  });
});