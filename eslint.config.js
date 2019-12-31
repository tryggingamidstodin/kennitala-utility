module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
    jquery: true
  },
  extends: 'standard',
  globals: {
    angular: false,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    cy: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'space-before-function-paren': 0,
    indent: 'off',
    'no-var': 'warn',
    'no-unused-expressions': 'warn',
    'comma-dangle': 'off'
  },
  ignorePatterns: ['js/', 'node_modules/']
}
