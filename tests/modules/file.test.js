const fileModule = require('../../src/modules/file');

jest.mock('fs/promises', () => ({
  readFile: jest.fn((path) => new Promise((resolve, reject) => {
    if (path === '/path/error.js') reject('Error reading file');
    else resolve({ prop: true });
  })),
  rm: jest.fn((path) => new Promise((resolve, reject) => {
    if (path === '/path/error') reject('Error removing folder');
    else resolve();
  })),
  access: jest.fn((path) => new Promise((resolve, reject) => {
    if (path === '/path/error.js') reject('Error');
    else resolve(true);
  })),
}));

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
  describe('fileExists()', () => {
    describe('happy path', () => {
      it('returns true when file exists', async () => {
        try {
          const path = '/path/file.js';
          const fileExists = await fileModule.fileExists(path);

          expect(fileExists).toBe(true);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('returns false when an error occurs or file does not exist', async () => {
        try {
          const path = '/path/error.js';
          const fileExists = await fileModule.fileExists(path);

          expect(fileExists).toBe(false);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
  });
});