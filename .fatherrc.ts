import { IBundleOptions } from 'father';

const options: IBundleOptions = {
  esm: 'babel',
  cjs: 'babel',
  disableTypeCheck: true,
  preCommit: {
    eslint: true,
    prettier: true,
  },
  pkgs: ['request', 'hooks'],
};

export default options;
