import Onion, { OnionMiddleware, OnionOptions } from './onion';
import simplePost from './middleware/simplePost';
import simpleGet from './middleware/simpleGet';
import parseResponse from './middleware/parseResponse';
import fetchMiddleware from './middleware/fetch';
import addfixInterceptor from './interceptor/addfix';
import { mergeRequestOptions } from './utils';
import { RequestOptionsInit, Context } from './types';
import { RequestInterceptor, ResponseInterceptor } from './interceptor';

// 初始化全局和内核中间件
const globalMiddlewares = [simplePost, simpleGet, parseResponse];
const coreMiddlewares = [fetchMiddleware];

Onion.globalMiddlewares = globalMiddlewares;
Onion.defaultGlobalMiddlewaresLength = globalMiddlewares.length;
Onion.coreMiddlewares = coreMiddlewares;
Onion.defaultCoreMiddlewaresLength = coreMiddlewares.length;

class Core {
  // 旧版拦截器为共享
  static requestInterceptors: RequestInterceptor[] = [addfixInterceptor];

  static responseInterceptors: ResponseInterceptor[] = [];

  onion: Onion;

  // mapCache = new MapCache(initOptions);

  initOptions: RequestOptionsInit;

  instanceRequestInterceptors: RequestInterceptor[] = [];

  instanceResponseInterceptors: ResponseInterceptor[] = [];

  constructor(initOptions: RequestOptionsInit) {
    this.onion = new Onion([]);
    // this.mapCache = new MapCache(initOptions);
    this.initOptions = initOptions;
    this.instanceRequestInterceptors = [];
    this.instanceResponseInterceptors = [];
  }

  // 请求拦截器
  static requestUse(handler: RequestInterceptor) {
    if (typeof handler !== 'function') {
      throw new TypeError('Interceptor must be function!');
    }
    Core.requestInterceptors.push(handler);
  }

  // 响应拦截器
  static responseUse(handler: ResponseInterceptor) {
    if (typeof handler !== 'function') {
      throw new TypeError('Interceptor must be function!');
    }
    Core.responseInterceptors.push(handler);
  }

  // 实例请求拦截器
  requestUse(handler: RequestInterceptor) {
    if (typeof handler !== 'function') {
      throw new TypeError('Interceptor must be function!');
    }

    this.instanceRequestInterceptors.push(handler);
  }

  // 实例相应拦截器
  responsetUse(handler: ResponseInterceptor) {
    if (typeof handler !== 'function') {
      throw new TypeError('Interceptor must be function!');
    }

    this.instanceResponseInterceptors.push(handler);
  }

  use(newMiddleware: OnionMiddleware, opt: OnionOptions = { global: false, core: false }) {
    this.onion.use(newMiddleware, opt);
    return this;
  }

  extendOptions(options: RequestOptionsInit) {
    this.initOptions = mergeRequestOptions(this.initOptions, options);
    // this.mapCache.extendOptions(options);
  }

  // 执行请求前拦截器
  dealRequestInterceptors(ctx: Context) {
    const reducer: any = (p1: any, p2: any) =>
      p1.then((ret: any = {}) => {
        ctx.req.url = ret.url || ctx.req.url;
        ctx.req.options = ret.options || ctx.req.options;
        return p2(ctx.req.url, ctx.req.options);
      });

    const allInterceptors = [...Core.requestInterceptors, ...this.instanceRequestInterceptors];

    return allInterceptors.reduce(reducer, Promise.resolve()).then((ret: any = {}) => {
      ctx.req.url = ret.url || ctx.req.url;
      ctx.req.options = ret.options || ctx.req.options;
      return Promise.resolve();
    });
  }

  request<T>(url: string, options: RequestOptionsInit): Promise<T> {
    const { onion } = this;
    const obj: Context = {
      req: { url, options },
      res: null,
      // cache: this.mapCache,
      responseInterceptors: [...Core.responseInterceptors, ...this.instanceResponseInterceptors],
    };
    if (typeof url !== 'string') {
      throw new Error('url MUST be a string');
    }

    return new Promise((resolve, reject) => {
      this.dealRequestInterceptors(obj)
        .then(() => onion.execute(obj))
        .then(() => {
          resolve(obj.res);
        })
        .catch(error => {
          const { errorHandler } = obj.req.options;
          if (errorHandler) {
            try {
              errorHandler(error);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(error);
          }
        });
    });
  }
}

export default Core;
