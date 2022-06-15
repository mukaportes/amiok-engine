const fs = require('fs/promises');
const { createReadStream } = require('fs');
const readline = require('readline');
const Stream = require('stream');
const fileModule = require('../../src/modules/file');
const { getStatsTemplate, mergeItemToResults } = require('../../src/modules/stats');

// Mocking: fs module
jest.mock('fs', () => ({
  createReadStream: jest.fn((filePath) => {
    if (filePath === '/path/error.js') throw 'Error creating file read stream';
    else return true;
  }),
}));

// Mocking: fs promises module
jest.mock('fs/promises', () => ({
  readdir: jest.fn(
    (path) =>
      new Promise((resolve, reject) => {
        if (path === '/error') reject('Error reading folder files');
        else resolve(['test.js']);
      })
  ),
  readFile: jest.fn(
    (path) =>
      new Promise((resolve, reject) => {
        if (path === '/path/error.js') reject('Error reading file');
        else resolve({ prop: true });
      })
  ),
  writeFile: jest.fn(
    (path) =>
      new Promise((resolve, reject) => {
        if (path === '/path/error-write.js') reject('Error creating file');
        else resolve(true);
      })
  ),
  access: jest.fn(
    (path) =>
      new Promise((resolve, reject) => {
        if (path === '/path/error.js' || path === '/path-error')
          reject('Error getting file access');
        else resolve(true);
      })
  ),
  rm: jest.fn(
    (path) =>
      new Promise((resolve, reject) => {
        if (path === '/path/error') reject('Error removing folder');
        else resolve();
      })
  ),
  mkdir: jest.fn(
    (path) =>
      new Promise((resolve, reject) => {
        if (path === '/path/error-folder') reject('Error creating folder');
        else resolve();
      })
  ),
}));

// Mocking: readline module
jest.mock('readline', () => ({
  createInterface: jest.fn(() => ({
    on: jest.fn((_, callback) => {
      callback({
        cpu: 1,
        memory: {
          rss: 1,
          heapTotal: 1,
          heapUsed: 1,
          external: 1,
          arrayBuffers: 1,
        },
        handles: 1,
      });
    }),
  })),
}));

// Mocking: stream module constructor
jest.mock('stream', () => jest.fn().mockImplementation(() => ({})));

describe('File Module Tests', () => {
  describe('getFileContent()', () => {
    describe('happy path', () => {
      it('returns file content and type of content', async () => {
        try {
          const path = '/path/file.js';
          const file = await fileModule.getFileContent(path);

          expect(file).toHaveProperty('type', 'object');
          expect(file.content).toStrictEqual({ prop: true });
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('throws exception when an error occurs', async () => {
        try {
          const path = '/path/error.js';
          await fileModule.getFileContent(path);
        } catch (error) {
          expect(error.message).toBe('Error reading file');
        }
      });
    });
  });
  describe('removeFolder()', () => {
    describe('happy path', () => {
      it('returns void when folder is removed', async () => {
        try {
          const path = '/path/file.js';
          const isRemoved = await fileModule.removeFolder(path);

          expect(isRemoved).toBeUndefined();
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('throws exception when an error occurs', async () => {
        try {
          const path = '/path/error';
          await fileModule.removeFolder(path);
        } catch (error) {
          expect(error.message).toBe('Error removing folder');
        }
      });
    });
  });
  describe('pathExists()', () => {
    describe('happy path', () => {
      it('returns true when file exists', async () => {
        try {
          const path = '/path/file.js';
          const pathExists = await fileModule.pathExists(path);

          expect(pathExists).toBe(true);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('throws an exception when an error occurs', async () => {
        try {
          const path = '/path/error.js';
          const pathExists = await fileModule.pathExists(path);

          expect(pathExists).toBe(false);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
  });
  describe('createFile()', () => {
    describe('happy path', () => {
      it('returns writeFile() result when file folder exists', async () => {
        try {
          const folderPath = '/path';
          const filePath = 'file.js';
          await fileModule.createFile(folderPath, filePath);

          expect(fs.access).toHaveBeenCalled();
          expect(fs.mkdir).not.toHaveBeenCalled();
          expect(fs.writeFile).toHaveBeenCalled();
        } catch (error) {
          throw new Error(error);
        }
      });
      it('creates new folder and returns writeFile() result when file folder do not exist', async () => {
        try {
          const folderPath = '/path-error';
          const filePath = 'error.js';
          await fileModule.createFile(folderPath, filePath);

          expect(fs.access).toHaveBeenCalled();
          expect(fs.mkdir).toHaveBeenCalled();
          expect(fs.writeFile).toHaveBeenCalled();
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('returns false when an error occurs or file does not exist', async () => {
        try {
          const folderPath = '/path';
          const filePath = 'error-write.js';
          await fileModule.createFile(folderPath, filePath);
        } catch (error) {
          expect(error.message).toBe('Error creating file');
        }
      });
    });
  });
  describe('readFileLines()', () => {
    describe('happy path', () => {
      it('returns stats template results', async () => {
        try {
          const filePath = '/path/file.js';
          const processLineFn = jest.fn((results, lineData) =>
            mergeItemToResults(results, lineData)
          );
          const statsTemplate = getStatsTemplate();
          const fileLines = await fileModule.readFileLines(filePath, processLineFn, statsTemplate);

          expect(fileLines).toStrictEqual({
            cpu: 1,
            memory: {
              rss: 1,
              heapTotal: 1,
              heapUsed: 1,
              external: 1,
              arrayBuffers: 1,
            },
            handles: 1,
            itemCount: 1,
          });
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('returns false when an error occurs or file does not exist', async () => {
        try {
          const filePath = '/path/error.js';
          const processLineFn = jest.fn((results, lineData) =>
            mergeItemToResults(results, lineData)
          );
          const statsTemplate = getStatsTemplate();
          await fileModule.readFileLines(filePath, processLineFn, statsTemplate);
        } catch (error) {
          expect(error.message).toBe('Error creating file read stream');
        }
      });
    });
  });
  describe('getFirstFileFromFolder()', () => {
    describe('happy path', () => {
      it('returns first file name from the folder provided', async () => {
        try {
          const path = '/path';
          const pathExists = await fileModule.getFirstFileFromFolder(path);

          expect(pathExists).toBe('test.js');
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('throws an exception when an error occurs', async () => {
        try {
          const path = '/error';
          await fileModule.getFirstFileFromFolder(path);
        } catch (error) {
          expect(error.message).toBe('Error reading folder files');
        }
      });
    });
  });
});
