const fullPipeline = require('./src/pipelines/full');
const { startAmiok, stopAmiok } = require('./src/modules/init');

module.exports = {
  fullPipeline,
  init: {
    startAmiok,
    stopAmiok,
  },
};
