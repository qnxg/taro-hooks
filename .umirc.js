export default {
  history: {
    type: 'hash',
  },
  hash: true,
  mode: 'site',
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  publicPath: './',
};
