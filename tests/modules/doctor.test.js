const fs = require('fs/promises');
const doctorModule = require('../../src/modules/doctor');

jest.mock('@nearform/doctor', () => {
  return jest.fn().mockImplementation(() => {
    return {
      collect: jest.fn(([, entrypoint], callback) => {
        if (entrypoint === '/path/error.js') callback('Doctor Collect Error');
        else callback(undefined, '/path/index.js');
      }),
      killCollectEmitter: 'MyCollectEmitter',
    };
  });
});

describe('Doctor Module Tests', () => {
  describe('execDoctor()', () => {
    describe('happy path', () => {
      it('executes afterCollectCallback and returns Doctor kill emitter', async () => {
        try {
          const entrypointPath = '/path/index.js';
          const afterCollectCallback = jest.fn();

          const emitter = await doctorModule
            .execDoctor(entrypointPath, afterCollectCallback);

          expect(emitter).toBe('MyCollectEmitter');
          expect(afterCollectCallback).toHaveBeenCalledWith({ filePath: entrypointPath });
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('returns rejected promise when an error occurs', async () => {
        const entrypointPath = '/path/error.js';
        const afterCollectCallback = jest.fn();
        try {
          await doctorModule
            .execDoctor(entrypointPath, afterCollectCallback);
        } catch (error) {
          expect(afterCollectCallback).not.toHaveBeenCalled();
          expect(error).toBe('Doctor Collect Error');
        }
      });
    });
  });
  describe('getAnalysisFile()', () => {
    describe('happy path', () => {
      it('returns promise resolved with the analysis file content', async () => {
        try {
          const processPid = 1234;
          const dirName = `${process.cwd()}/${processPid}.clinic-doctor`;
          const path = `${process.cwd()}/${processPid}.clinic-doctor/${processPid}.clinic-doctor-processstat`;
          await fs.mkdir(dirName);
          await fs.copyFile(`${process.cwd()}/tests/mocks/report-file`, path);

          const reportFileContent = await doctorModule.getAnalysisFile(processPid);

          expect(typeof reportFileContent).toBe('string');
          expect(reportFileContent).toHaveLength(25487);

          await fs.rm(dirName, { recursive: true, force: true });
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('returns promise rejected with error when the process pid is not provided', async () => {
        try {
          await doctorModule.getAnalysisFile();
        } catch (error) {
          expect(error).toBe('A process pid must be provided.');
        }
      });
      it('returns promise rejected with error when stream error event is emitter', async () => {
        const processPid = 5555;
        try {
          await doctorModule.getAnalysisFile(processPid);
        } catch (error) {
          expect(error).toHaveProperty('code', 'ENOENT');
        }
      });
      it('returns promise rejected with error when an exception occurs', async () => {
        const processPid = 5555;
        process.cwd = jest.fn(() => {
          throw new Error('Force exception');
        });
        try {
          await doctorModule.getAnalysisFile(processPid);
        } catch (error) {
          expect(error).toStrictEqual(new Error('Force exception'));
        }
      });
    });
  });
});