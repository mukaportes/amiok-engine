const nock = require('nock');
const httpModule = require('../../src/modules/http');

describe('HTTP Module Tests', () => {
  describe('runSequence()', () => {
    describe('happy path', () => {
      it('returns response stats objects', async () => {
        try {
          const config = {
            basePath: 'https://some.path',
          };
          const testScripts = [
            {
              path: '/test',
              method: 'GET',
              headers: {
                Authorization: 'someToken',
              },
              assert: {
                mock: [1, 2, 3],
              },
            },
            {
              path: '/test',
              method: 'POST',
              assert: {
                mock: [{ prop: true }],
              },
            },
          ];

          nock(config.basePath).get(testScripts[0].path).reply(200, testScripts[0].assert);
          nock(config.basePath).post(testScripts[1].path).reply(200, testScripts[1].assert);

          const stats = await httpModule.runSequence(config, testScripts);

          expect(stats.responseStatus).toHaveProperty('200', 2);
          expect(stats.logs).toHaveLength(2);
          expect(stats.logs[0].path).toBe(testScripts[0].path);
          expect(stats.logs[0]).toHaveProperty('startTime');
          expect(stats.logs[0]).toHaveProperty('endTime');
          expect(stats.logs[1].path).toBe(testScripts[1].path);
          expect(stats.logs[1]).toHaveProperty('startTime');
          expect(stats.logs[1]).toHaveProperty('endTime');
          expect(stats.assert).toHaveProperty('pass', 2);
          expect(stats.assert).toHaveProperty('fail', 0);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
    describe('unhappy path', () => {
      it('returns stats for empty list when test scripts are not defined', async () => {
        try {
          const stats = await httpModule.runSequence({});

          expect(stats.responseStatus).toStrictEqual({});
          expect(stats.logs).toHaveLength(0);
          expect(stats.assert).toHaveProperty('pass', 0);
          expect(stats.assert).toHaveProperty('fail', 0);
        } catch (error) {
          throw new Error(error);
        }
      });
      it('returns assert error stats objects', async () => {
        try {
          const config = {
            basePath: 'https://some.path',
          };
          const testScripts = [
            {
              path: '/test',
              method: 'GET',
              headers: {
                Authorization: 'someToken',
              },
              assert: {
                mock: [1, 2, 3],
              },
            },
            {
              path: '/test',
              method: 'POST',
              assert: {
                mock: [{ prop: true }],
              },
            },
          ];

          nock(config.basePath).get(testScripts[0].path).reply(200, testScripts[0].assert);
          nock(config.basePath).post(testScripts[1].path).reply(200, { forceError: true });

          const stats = await httpModule.runSequence(config, testScripts);

          expect(stats.responseStatus).toHaveProperty('200', 2);
          expect(stats.logs).toHaveLength(2);
          expect(stats.logs[0].path).toBe(testScripts[0].path);
          expect(stats.logs[0]).toHaveProperty('startTime');
          expect(stats.logs[0]).toHaveProperty('endTime');
          expect(stats.logs[1].path).toBe(testScripts[1].path);
          expect(stats.logs[1]).toHaveProperty('startTime');
          expect(stats.logs[1]).toHaveProperty('endTime');
          expect(stats.assert).toHaveProperty('pass', 1);
          expect(stats.assert).toHaveProperty('fail', 1);
        } catch (error) {
          throw new Error(error);
        }
      });
      it('returns error response stats objects', async () => {
        try {
          const config = {
            basePath: 'https://some.path',
          };
          const testScripts = [
            {
              path: '/test',
              method: 'GET',
              headers: {
                Authorization: 'someToken',
              },
            },
            {
              path: '/test',
              method: 'POST',
              assert: {
                mock: [{ prop: true }],
              },
            },
          ];

          nock(config.basePath).get(testScripts[0].path).reply(200, testScripts[0].assert);
          nock(config.basePath).post(testScripts[1].path).reply(500, { forceError: true });

          const stats = await httpModule.runSequence(config, testScripts);

          expect(stats.responseStatus).toHaveProperty('200', 1);
          expect(stats.responseStatus).toHaveProperty('500', 1);
          expect(stats.logs).toHaveLength(2);
          expect(stats.logs[0].path).toBe(testScripts[0].path);
          expect(stats.logs[0]).toHaveProperty('startTime');
          expect(stats.logs[0]).toHaveProperty('endTime');
          expect(stats.logs[1].path).toBe(testScripts[1].path);
          expect(stats.logs[1]).toHaveProperty('startTime');
          expect(stats.logs[1]).toHaveProperty('endTime');
          expect(stats.assert).toHaveProperty('pass', 1);
          expect(stats.assert).toHaveProperty('fail', 1);
        } catch (error) {
          throw new Error(error);
        }
      });
      it('returns empty stats when exception is thrown', async () => {
        try {
          const config = {
            basePath: 'https://some.path',
          };
          const testScripts = [
            {
              path: '/test',
              // NOTE: force string error
              method: [1234],
              headers: {
                Authorization: 'someToken',
              },
              assert: {
                mock: [1, 2, 3],
              },
            },
          ];
          const stats = await httpModule.runSequence(config, testScripts);

          expect(stats.responseStatus).toStrictEqual({});
          expect(stats.logs).toHaveLength(0);
          expect(stats.assert).toHaveProperty('pass', 0);
          expect(stats.assert).toHaveProperty('fail', 0);
        } catch (error) {
          throw new Error(error);
        }
      });
    });
  });
});
