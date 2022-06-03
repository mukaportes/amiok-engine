const os = require('os');
const { spawn } = require('child_process');
const { addStatsToFile } = require('./stats');


const getCpuPercentage = (targetProcess) => {
  // Take the first CPU, considering every CPUs have the same specs
  // and every NodeJS process only uses one at a time.
  const cpus = os.cpus();
  const cpu = cpus[0];

  // Accumulate every CPU times values
  const total = Object.values(cpu.times).reduce(
    (acc, tv) => acc + tv, 0
  );

  // Normalize the one returned by process.cpuUsage() 
  // (microseconds VS miliseconds)
  const usage = targetProcess.cpuUsage();
  const currentCPUUsage = (usage.user + usage.system) * 1000;

  // Find out the percentage used for this specific CPU
  return currentCPUUsage / total * 100;
};

const getAnalysis = (targetProcess) => {
  const cpuUsage = getCpuPercentage(targetProcess);
  const memory = targetProcess.memoryUsage();
  const numActiveHandles = targetProcess._getActiveHandles().length;

  let outputStr = '';

  outputStr += `${cpuUsage}-`;
  outputStr += `${memory.rss}-${memory.heapTotal}-${memory.heapUsed}-${memory.external}-${memory.arrayBuffers}-`;
  outputStr += `${numActiveHandles}-`;
  outputStr += `${new Date().toISOString()}`;

  return outputStr;
};

let startAmiok;
let stopAmiok;
const enableAmiok = (targetProcess) => {
  startAmiok = () => setInterval(() => {
    addStatsToFile(getAnalysis(targetProcess));
  }, 100);

  stopAmiok = startAmiok.clearInterval();
};

module.exports = {
  enableAmiok,
  startAmiok,
  stopAmiok,
};