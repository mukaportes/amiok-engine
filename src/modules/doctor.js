const fs = require('fs');
const pumpify = require('pumpify');
const Stringify = require('streaming-json-stringify')
const streamTemplate = require('stream-template')
const ProcessStatDecoder = require('@nearform/doctor/format/process-stat-decoder');
const ClinicDoctor = require('@nearform/doctor');
const { netstatByPort } = require('../modules/cmd');
const { getFileContent } = require('../modules/file');

const execDoctor = (appStarterPath, afterCollectCallback) => new Promise(async (resolve, reject) => {
  try {
    const doctor = new ClinicDoctor();

    doctor.collect(['node', appStarterPath], function (err, filepath) {
      if (err) throw err;
      afterCollectCallback({ filePath: filepath });
    });

    resolve(doctor.killCollectEmitter);
  } catch (error) {
    console.error('execDoctor error', error);

    reject(error);
  }
});

const getAnalysisFile = (port, pid = null) => new Promise(async (resolve, reject) => {
  try {
    let doctorProcessPid;

    if (!pid) {
      ({ pid: doctorProcessPid } = await netstatByPort(port));
    } else {
      doctorProcessPid = pid;
    }

    const path = `${process.cwd()}/${doctorProcessPid}.clinic-doctor/${doctorProcessPid}.clinic-doctor-processstat`;

    const processStatReader = pumpify.obj(
      fs.createReadStream(path),
      new ProcessStatDecoder()
    );

    const processStatStringify = pumpify(
      processStatReader,
      new Stringify({
        seperator: ',\n',
        stringifier: JSON.stringify
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
  } catch (error) {
    console.error('Error retrieving analysis file', error);

    reject(error);
  }
});

module.exports = {
  execDoctor,
  getAnalysisFile,
}