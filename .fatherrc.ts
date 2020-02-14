import { IBundleOptions } from 'father';

const options: IBundleOptions = {
  esm: 'babel',
  cjs: 'babel',
  disableTypeCheck: true,
  preCommit: {
    eslint: true,
    prettier: true,
  },
  pkgs: ['request', 'hooks', 'use-request'],
};

export default options;
