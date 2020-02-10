export default {
  hash: true,
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
  doc: {
    title: 'Taro Hooks',
    include: [],
    locales: [
      ['en-US', 'English'],
      ['zh-CN', '中文'],
    ],
  },
  plugins: [
    [
      'umi-plugin-react',
      {
        pwa: true,
      },
    ],
  ],
};
