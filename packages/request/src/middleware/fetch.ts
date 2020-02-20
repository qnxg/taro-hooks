import { request, uploadFile } from '@tarojs/taro';
import { timeout2Throw, cancel2Throw } from '../utils';
import { OnionMiddleware } from '../onion';
import { RequestOptionsInit } from '../types';

// 是否进行了警告
let warnedCoreType = false;

// 默认缓存判断，开放缓存判断给非 get 请求使用
function __defaultValidateCache(_: string, options: RequestOptionsInit) {
  const { method = 'get' } = options;
  return method.toLowerCase() === 'get';
}

const fetchMiddleware: OnionMiddleware = (ctx, next) => {
  if (!ctx) {
    return;
  }

  const { req: { options = {}, url = '' } = {}, responseInterceptors, cache } = ctx;
  const {
    timeout = 0,
    requestType = 'json',
    formKey = 'file',
    __qnxgRequestCoreType__ = 'normal',
    useCache = false,
    validateCache = __defaultValidateCache,
    params,
    method,
    ttl = 0,
  } = options;

  // 供调试使用, 不发送具体请求, 或者调整 core 中间件
  if (__qnxgRequestCoreType__ !== 'normal') {
    if (warnedCoreType === false) {
      warnedCoreType = true;
      console.warn(
        '__qnxgRequestCoreType__ is a internal property that use in qnxg-request, change its value would affect the behavior of request! It only use when you want to extend or use request core.',
      );
    }
    return next();
  }

  if (!request || !uploadFile) {
    throw new Error('Taro not exist!');
  }

  // 从缓存池检查是否有缓存数据
  const needCache = validateCache(url, options) && useCache;
  if (needCache) {
    const responseCache = cache.get({
      url,
      params,
      method,
    });
    if (responseCache) {
      ctx.res = responseCache;
      return next();
    }
  }

  let response: any;

  // 超时处理、取消请求处理
  const timeoutFunc = () => {
    if (timeout > 0) {
      return [cancel2Throw(options), timeout2Throw(timeout, ctx.req)];
    }
    return [cancel2Throw(options)];
  };

  // 发送文件处理
  const formFunc = () => {
    if (requestType === 'json') {
      return [
        request({
          url,
          data: options.data,
          header: options.headers,
          method: options.method || 'GET',
          credentials: options.credentials,
        }),
      ];
    }
    return [
      uploadFile({
        url,
        filePath: options.data[formKey],
        name: formKey,
        formData: options.data,
        header: options.headers,
      }),
    ];
  };

  response = Promise.race([...timeoutFunc(), ...formFunc()]);

  // 兼容老版本 response.interceptor
  responseInterceptors.forEach(handler => {
    response = response.then((res: any) => {
      const clonedRes = typeof res.clone === 'function' ? res.clone() : res;
      return handler(clonedRes, options);
    });
  });

  return response.then((res: any) => {
    // 是否存入缓存池
    if (needCache) {
      if (res.statusCode === 200) {
        const copy = JSON.parse(JSON.stringify(res));
        copy.useCache = true;
        cache.set({ url, params, method }, copy, ttl);
      }
    }

    ctx.res = res;
    return next();
  });
};

export default fetchMiddleware;
