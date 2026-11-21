const js = require('@eslint/js');
const globals = require('globals');
const security = require('eslint-plugin-security');

module.exports = [
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },
  js.configs.recommended,
  security.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: { sourceType: 'script', globals: { ...globals.browser, module: 'writable' } }
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.js', 'eslint.config.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node, ...globals.jest } }
  }
];
