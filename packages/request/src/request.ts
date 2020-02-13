import Core from './core';
import Cancel from './cancel/cancel';
import CancelToken from './cancel/cancelToken';
import isCancel from './cancel/isCancel';
import Oinon, { OnionMiddleware, OnionOptions } from './onion';
import { mergeRequestOptions } from './utils';
import {
  RequestOptionsInit,
  RequestOptionsWithResponse,
  RequestResponse,
  RequestOptionsWithoutResponse,
} from './types';
import { RequestInterceptor, ResponseInterceptor } from './interceptor/index';

export interface RequestMethod<R = false> {
  <T = any>(url: string, options: RequestOptionsWithResponse): Promise<RequestResponse<T>>;
  <T = any>(url: string, options: RequestOptionsWithoutResponse): Promise<T>;
  <T = any>(url: string, options?: RequestOptionsInit): R extends true
    ? Promise<RequestResponse<T>>
    : Promise<T>;
  get: RequestMethod<R>;
  post: RequestMethod<R>;
  delete: RequestMethod<R>;
  put: RequestMethod<R>;
  patch: RequestMethod<R>;
  head: RequestMethod<R>;
  options: RequestMethod<R>;
  rpc: RequestMethod<R>;
  interceptors: {
    request: {
      coreUse: (handler: RequestInterceptor) => void;
      use: (handler: RequestInterceptor) => void;
    };
    response: {
      coreUse: (handler: ResponseInterceptor) => void;
      use: (handler: ResponseInterceptor) => void;
    };
  };
  use: (handler: OnionMiddleware, options?: OnionOptions) => void;
  Cancel: typeof Cancel;
  CancelToken: typeof CancelToken;
  isCancel(value: any): boolean;
  extendOptions: (options: RequestOptionsInit) => void;
  middlewares: {
    instance: OnionMiddleware[];
    defaultInstance: OnionMiddleware[];
    global: OnionMiddleware[];
    core: OnionMiddleware[];
  };
}

// 通过 request 函数，在 core 之上再封装一层，提供 api
const request = <T = any>(initOptions: RequestOptionsInit = {}): RequestMethod<T> => {
  const coreInstance = new Core(initOptions);
  const qnxgInstance: any = (url: string, options: RequestOptionsInit = {}) => {
    const mergeOptions = mergeRequestOptions(coreInstance.initOptions, options);
    return coreInstance.request<T>(url, mergeOptions);
  };

  // 中间件
  qnxgInstance.use = coreInstance.use.bind(coreInstance);

  // 拦截器
  qnxgInstance.interceptors = {
    request: {
      coreUse: Core.requestUse.bind(coreInstance),
      use: coreInstance.requestUse.bind(coreInstance),
    },
    response: {
      coreUse: Core.responseUse.bind(coreInstance),
      use: coreInstance.responsetUse.bind(coreInstance),
    },
  };

  // 请求语法糖： reguest.get request.post ……
  const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options'];
  METHODS.forEach(method => {
    qnxgInstance[method] = (url: string, options: RequestOptionsInit) =>
      qnxgInstance(url, { ...options, method });
  });

  qnxgInstance.Cancel = Cancel;
  qnxgInstance.CancelToken = CancelToken;
  qnxgInstance.isCancel = isCancel;

  qnxgInstance.extendOptions = coreInstance.extendOptions.bind(coreInstance);

  // 暴露各个实例的中间件，供开发者自由组合
  qnxgInstance.middlewares = {
    instance: coreInstance.onion.middlewares,
    defaultInstance: coreInstance.onion.defaultMiddlewares,
    global: Oinon.globalMiddlewares,
    core: Oinon.coreMiddlewares,
  };

  return qnxgInstance;
};

/**
 * extend 方法参考了ky, 让用户可以定制配置.
 * initOpions 初始化参数
 * @param {number} maxCache 最大缓存数
 * @param {string} prefix url前缀
 * @param {function} errorHandler 统一错误处理方法
 * @param {object} headers 统一的headers
 */
export const extend = (initOptions: RequestOptionsInit) => request(initOptions);

export default request({});
