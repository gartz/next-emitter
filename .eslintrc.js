module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': [
    'standard'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
    'semi': 'off',
    'standard/no-callback-literal': ['off', ['cb', 'callback']],
    'comma-dangle': ['error', 'always']
  }
}
