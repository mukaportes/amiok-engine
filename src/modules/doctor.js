const fs = require('fs');
const pumpify = require('pumpify');
const Stringify = require('streaming-json-stringify');
const streamTemplate = require('stream-template');
const ProcessStatDecoder = require('@nearform/doctor/format/process-stat-decoder');
const ClinicDoctor = require('@nearform/doctor');

const execDoctor = (entrypointPath, afterCollectCallback) =>
  new Promise((resolve, reject) => {
    try {
      const doctor = new ClinicDoctor();

      doctor.collect(['node', entrypointPath], (err, filepath) => {
        if (err) throw err;
        afterCollectCallback({ filePath: filepath });
      });

      resolve(doctor.killCollectEmitter);
    } catch (error) {
      console.error('execDoctor error', error);

      reject(error);
    }
  });

const getAnalysisFile = (doctorProcessPid) =>
  new Promise((resolve, reject) => {
    try {
      if (!doctorProcessPid) reject('A process pid must be provided.');
      const path = `${process.cwd()}/${doctorProcessPid}.clinic-doctor/${doctorProcessPid}.clinic-doctor-processstat`;

      const processStatReader = pumpify.obj(fs.createReadStream(path), new ProcessStatDecoder());

      const processStatStringify = pumpify(
        processStatReader,
        new Stringify({
          separator: ',\n',
          stringifier: JSON.stringify,
        })
      );
      
      const processStatStream = streamTemplate`${processStatStringify}`;
      let processstat = '';

      processStatStream.on('data', (data) => {
        processstat += Buffer.from(data).toString();
      });

      processStatStream.on('end', () => {
        resolve(processstat);
      });

      processStatStream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      console.error('Error retrieving analysis file', error);

      reject(error);
    }
  });

module.exports = {
  execDoctor,
  getAnalysisFile,
};
