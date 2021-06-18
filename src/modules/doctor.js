const fs = require('fs');
const ClinicDoctor = require('@nearform/doctor');

const execDoctor = (appStarterPath) => new Promise(async (resolve, reject) => {
  try {
    const doctor = new ClinicDoctor();

    doctor.collect(['node', appStarterPath], function (err, filepath) {
      if (err) throw err

      const reportDataPath = `${filepath}/${filepath}-traceevent`;

      // doctor.visualize(filepath, filepath + '.html', function (err) {
      //   if (err) throw err
      // });

      // get file filepath + '.html'
      fs.readFile(reportDataPath, 'utf8', function (err, content) {
        if (err) throw err;

        console.log('typeof content', typeof content);
        // console.log('content', content);
      });
    });
  } catch (error) {
    console.error('execDoctor error =================', error);

    reject(error);
  }
});

module.exports = {
  execDoctor,
}