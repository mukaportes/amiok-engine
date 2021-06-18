const { execDoctor } = require('../../modules/doctor');

module.exports = async ({ appStarterPath = '.' }, context) => {
  try {
    // const cmd = `clinic doctor -- node ${appStarterPath}`;


    await execDoctor(appStarterPath);
  } catch (error) {
    console.error('error executing start server process', error);

    throw error;
  }
};
