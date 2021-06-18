const ClinicDoctor = require('@nearform/doctor');

const execDoctor = (appStarterPath, afterCollectCallback) => new Promise(async (resolve, reject) => {
  try {
    const doctor = new ClinicDoctor();

    doctor.collect(['node', appStarterPath], function (err, filepath) {
      if (err) throw err

      afterCollectCallback({ filePath: `${filepath}/${filepath}-traceevent` });
    });

    resolve('doctor.collect started');
  } catch (error) {
    console.error('execDoctor error', error);

    reject(error);
  }
});

module.exports = {
  execDoctor,
}