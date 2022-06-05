module.exports = {
  extends: ['airbnb', 'prettier', 'plugin:node/recommended'],
  plugins: ['prettier'],
  // env: {
  //   'jest/globals': true,
  // },
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'func-names': 'off',
    'no-process-exit': 'off',
    'object-shorthand': 'off',
  },
};
