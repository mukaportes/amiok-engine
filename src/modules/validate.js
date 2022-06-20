const isObject = (input) => typeof input === 'object' && Object.keys(input).length;
const isNumber = (input) => !Number.isNaN(Number(input));
const isString = (input) => typeof input === 'string';
const isFunction = (input) => typeof input === 'function';
const isBoolean = (input) => typeof input === 'boolean';

module.exports = {
  isObject,
  isNumber,
  isString,
  isFunction,
  isBoolean,
};
