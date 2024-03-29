module.exports = {
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  extends: ['standard', 'eslint:recommended', 'plugin:node/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-console': 'warn',
    semi: ['error', 'never']
  }
};
