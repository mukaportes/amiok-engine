const suffix = `[AMIOK] `;

module.exports = {
  info: (...log) => console.info(suffix, ...log),
  error: (...log) => console.error(suffix, ...log),
};
