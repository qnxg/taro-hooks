import Taro from '@tarojs/taro';
import { stringify } from 'qs';
import { Req, RequestOptionsInit } from './types';
import Cancel from './cancel/cancel';

// export class MapCache {
//   keyMap: any;

//   cache: Array<any>;

//   timer: Array<any>;

//   maxCache: number = 0;

//   constructor(options: RequestOptionsInit) {
//     this.keyMap = {};
//     this.cache = [];
//     this.timer = [];
//     this.extendOptions(options);
//   }

//   extendOptions(options: RequestOptionsInit) {
//     this.maxCache = options.maxCache ? options.maxCache : 0;
//   }

//   get(key: any) {
//     return this.cache[this.keyMap[JSON.stringify(key)]];
//   }

//   set(key: any, value: any, ttl = 60000) {
//     const cacheKey = JSON.stringify(key);
//     this.keyMap[cacheKey] = this.cache.length;
//     this.cache.push(value);
//     if (ttl > 0) {
//       this.timer.push(
//         setTimeout(() => {
//           this.cache.delete(cacheKey);
//           delete this.timer[cacheKey];
//         }, ttl),
//       );
//     }
//   }

//   delete(key: any) {
//     const cacheKey = JSON.stringify(key);
//     delete this.timer[cacheKey];
//     delete this.cache[cacheKey];
//   }

//   clear() {
//     this.timer = [];
//     this.cache = [];
//     this.keyMap = {};
//   }
// }

/**
 * 请求错误
 */
export class RequestError extends Error {
  request: Req;

  type: string;

  constructor(text: string, request: Req, type = 'RequestError') {
    super(text);
    this.name = 'RequestError';
    this.request = request;
    this.type = type;
  }
}

/**
 * 响应错误
 */
export class ResponseError<T = any> extends Error {
  data: any;

  response: Taro.request.Promised;

  request: Req;

  type: string;

  constructor(
    response: Taro.request.Promised<T>,
    text: string,
    data: T,
    request: Req,
    type = 'ResponseError',
  ) {
    super(text);
    this.name = 'ResponseError';
    this.data = data;
    this.response = response;
    this.request = request;
    this.type = type;
  }
}

/**
 * 判断传入的参数是否由数组构成
 * @param val
 */
export function isArray(val: object) {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Array]';
}

/**
 * 判断传入的是否为 object
 * @param val
 */
export function isObject(val: object) {
  return val !== null && typeof val === 'object';
}

/**
 * 判断传入的是否为 Date
 * @param val
 */
export function isDate(val: object) {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Date]';
}

/**
 * 遍历 params 并对其中的参数进行 callback 处理
 * @param target
 * @param callback
 */
export function forEach2ObjArr(target: any, callback: Function) {
  let originTarget = target;

  if (!originTarget) {
    return;
  }

  if (typeof originTarget !== 'object') {
    originTarget = [originTarget];
  }

  if (isArray(originTarget)) {
    for (let i = 0; i < originTarget.length; i++) {
      callback.call(null, originTarget[i], i, originTarget);
    }
  } else {
    for (const key in originTarget) {
      if (Object.prototype.hasOwnProperty.call(originTarget, key)) {
        callback.call(null, originTarget[key], key, originTarget);
      }
    }
  }
}

/**
 * qs库进行序列化
 * @param val
 */
export function reqStringify(val: any) {
  return stringify(val, { arrayFormat: 'repeat', strictNullHandling: true });
}

/**
 * 超时处理
 * @param msec 超时毫秒数
 * @param request
 */
export function timeout2Throw(msec: number, request: Req) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new RequestError(`timeout of ${msec}ms exceeded`, request, 'Timeout'));
    }, msec);
  });
}

// If request options contain 'cancelToken', reject request when token has been canceled
/**
 * 关闭请求
 * @param opt
 */
export function cancel2Throw(opt: RequestOptionsInit) {
  return new Promise((_, reject) => {
    if (opt.cancelToken) {
      opt.cancelToken.promise.then((cancel: Cancel) => {
        reject(cancel);
      });
    }
  });
}

export function getParamObject(val: any) {
  if (typeof val === 'string') {
    return [val];
  }
  return val;
}

export function mergeRequestOptions(
  options: RequestOptionsInit,
  options2Merge: RequestOptionsInit,
): RequestOptionsInit {
  return {
    ...options,
    ...options2Merge,
    headers: {
      ...options.headers,
      ...options2Merge.headers,
    },
    params: {
      ...getParamObject(options.params),
      ...getParamObject(options2Merge.params),
    },
    method: (options2Merge.method || options.method || 'get').toLowerCase() as any,
  };
}
