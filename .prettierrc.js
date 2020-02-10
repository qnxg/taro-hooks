module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  overrides: [
    {
      files: '.prettierrc.js',
      options: { parser: 'json' },
    },
  ],
};
