const crypto = require('crypto');
const os = require('os');
const { createFile } = require('./file');
const { addStatsToFile, getReportFilePath } = require('./stats');

const getCpuPercentage = (targetProcess) => {
  // Take the first CPU, considering every CPUs have the same specs
  // and every NodeJS process only uses one at a time.
  const cpus = os.cpus();
  const cpu = cpus[0];

  // Accumulate every CPU times values
  const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);

  // Normalize the one returned by process.cpuUsage()
  // (microseconds VS miliseconds)
  const usage = targetProcess.cpuUsage();
  const currentCpuUsage = (usage.user + usage.system) * 1000;

  // Find out the percentage used for this specific CPU
  return (currentCpuUsage / total) * 100;
};

const getAnalysis = (targetProcess) => {
  const cpuUsage = getCpuPercentage(targetProcess);
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

const startAmiok = async (targetProcess) => {
  const { fileFolder, fileName } = getReportFilePath();
  const testId = crypto.randomUUID();
  console.log('{ fileFolder, fileName } @ createStatsFile', { fileFolder, fileName });
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
