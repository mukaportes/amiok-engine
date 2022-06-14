const crypto = require('crypto');
const os = require('os');
const { createFile } = require('./file');
const { addStatsToFile, getReportFilePath, setCurrentTestId } = require('./stats');

let previousIdle = 0;
let previousTotal = 0;

/**
 *
 * @returns {number}
 */
const getCpuPercentage = () => {
  let totalIdle = 0;
  let totalTick = 0;
  const cpus = os.cpus();

  for (let i = 0, len = cpus.length; i < len; i += 1) {
    const cpu = cpus[i];
    // eslint-disable-next-line
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  }

  const avgIdle = totalIdle / cpus.length;
  const avgTotal = totalTick / cpus.length;

  const idle = previousIdle ? avgIdle : avgIdle - previousIdle;
  const total = previousTotal ? avgTotal : avgTotal - previousTotal;

  if (previousIdle && previousTotal) {
    previousIdle = avgIdle;
    previousTotal = avgTotal;
  }

  return (10000 - Math.round((10000 * idle) / total)) / 100;
};

/**
 *
 * @param {object} targetProcess NodeJS process
 * @returns {string}
 */
const getAnalysis = (targetProcess) => {
  const cpuUsage = getCpuPercentage();
  const memory = targetProcess.memoryUsage();
  // eslint-disable-next-line no-underscore-dangle
  const numActiveHandles = targetProcess._getActiveHandles().length;

  let outputStr = '';

  outputStr += `${cpuUsage}|`;
  outputStr += `${memory.rss}|${memory.heapTotal}|${memory.heapUsed}|${memory.external}|${memory.arrayBuffers}|`;
  outputStr += `${numActiveHandles}|`;
  outputStr += `${new Date().toISOString()}`;

  return outputStr;
};

let interval;

/**
 *
 * @param {object} targetProcess NodeJS process
 */
const startAmiok = async (targetProcess) => {
  const { fileFolder, fileName } = getReportFilePath();
  const testId = crypto.randomUUID();
  setCurrentTestId(testId);
  await createFile(fileFolder, fileName.replace('undefined', testId));

  interval = setInterval(() => {
    addStatsToFile(getAnalysis(targetProcess));
  }, 10);
};

const stopAmiok = () => interval.clearInterval();

module.exports = {
  startAmiok,
  stopAmiok,
};
