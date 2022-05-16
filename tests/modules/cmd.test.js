const { execSync } = require('child_process');
const cmdModule = require('../../src/modules/cmd');

jest.mock('node-netstat', () => jest.fn((options, callback) => {
  if (options.filter.local.port === 9999) return callback({ process: 123 }, 'Netstat error');
  else return callback({ process: 123 });
}));
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

describe('Cmd Module Tests', () => {
  describe('execCmd()', () => {
    describe('happy path', () => {
      it('executes child process execSync', () => {
        try {
          const cmd = 'npm run test';
          cmdModule.execCmd(cmd);

          expect(execSync).toHaveBeenCalledWith(
            cmd, { stdio: [0, 1, 2] },
          );
        } catch (error) {
          throw error;
        }
      });
    });
    describe('unhappy path', () => {
      it('throws exception when no command is provided', () => {
        try {
          cmdModule.execCmd();
        } catch (error) {
          expect(error.message).toBe('Error: A command must be provided.');
        }
      });
    });
  });
  describe('execCmd()', () => {
    describe('happy path', () => {
      it('returns promise resolved with netstat item', async () => {
        try {
          const port = 3000;
          
          const netstatRes = await cmdModule.netstatByPort(port);

          expect(netstatRes).toStrictEqual({ process: 123 });
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('throws exception when no port is provided', async () => {
        try {
          await cmdModule.netstatByPort();
        } catch (error) {
          expect(error.message).toBe('A port must be provided.');
        }
      });
      it('returns rejected promise when an error occurs with netstat', async () => {
        try {
          const port = 9999;
          
          await cmdModule.netstatByPort(port);
        } catch (error) {
          expect(error).toBe('Netstat error');
        }
      });
    });
  });
});