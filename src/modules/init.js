const crypto = require('crypto');
const os = require('os');
const { createFile } = require('./file');
const { addStatsToFile, getReportFilePath, setCurrentTestId } = require('./stats');

global.amiokPreviousCpuIdle = 0;
global.amiokPreviousCpuTotal = 0;

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

  const idle = global.amiokPreviousCpuIdle ? avgIdle : avgIdle - global.amiokPreviousCpuIdle;
  const total = global.amiokPreviousCpuTotal ? avgTotal : avgTotal - global.amiokPreviousCpuTotal;

  global.amiokPreviousCpuIdle = avgIdle;
  global.amiokPreviousCpuTotal = avgTotal;

  return (10000 - Math.round((10000 * idle) / total)) / 100;
};

/**
 *
 * @returns {string}
 */
const getAnalysis = () => {
  const cpuUsage = getCpuPercentage();
  const memory = process.memoryUsage();
  // eslint-disable-next-line no-underscore-dangle
  const numActiveHandles = process._getActiveHandles().length;

  let outputStr = '';

  outputStr += `${cpuUsage}|`;
  outputStr += `${memory.rss}|${memory.heapTotal}|${memory.heapUsed}|${memory.external}|${memory.arrayBuffers}|`;
  outputStr += `${numActiveHandles}|`;
  outputStr += `${new Date().toISOString()}`;

  return outputStr;
};

let interval;

const startAmiok = async () => {
  const { fileFolder, fileName } = getReportFilePath();

  const testId = crypto.randomUUID();
  setCurrentTestId(testId);

  await createFile(fileFolder, fileName.replace('undefined', testId));

  interval = setInterval(() => {
    addStatsToFile(getAnalysis());
  }, 10);
};

const stopAmiok = () => clearInterval(interval);

module.exports = {
  getCpuPercentage,
  startAmiok,
  stopAmiok,
};
