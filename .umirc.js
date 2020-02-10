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
    include: ['packages/hooks/src'],
    locales: [
      ['zh-CN', '中文'],
      ['en-US', 'English'],
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
