const waitFor = (staticDelay = 3000) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, staticDelay);
  });

module.exports = {
  waitFor,
}