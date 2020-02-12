import { RequestOptionsInit } from '../types';

// 默认拦截器, 添加对应的URL前缀或后缀
const addfix = (url: string, options: RequestOptionsInit = {}) => {
  let urlAddFix = url;
  const { prefix, suffix } = options;
  if (prefix) {
    urlAddFix = `${prefix}${urlAddFix}`;
  }
  if (suffix) {
    urlAddFix = `${urlAddFix}${suffix}`;
  }

  return { url: urlAddFix, options };
};

export default addfix;
