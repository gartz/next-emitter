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
    'semi': [2, 'always'],
    'standard/no-callback-literal': [0, ['cb', 'callback']],
    'comma-dangle': [2, 'always'],
    'standard/object-curly-even-spacing': 0
  }
}
