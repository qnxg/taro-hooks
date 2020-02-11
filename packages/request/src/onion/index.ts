import { Context } from '../types';
import compose from './compose';

export type OnionMiddleware = (ctx: Context, next: () => void) => void;
export type OnionOptions = { global?: boolean; core?: boolean; defaultInstance?: boolean };

class Onion {
  defaultMiddlewares: OnionMiddleware[];

  middlewares: OnionMiddleware[];

  static globalMiddlewares = []; // 全局中间件

  static defaultGlobalMiddlewaresLength = 0; // 内置全局中间件长度

  static coreMiddlewares = []; // 内核中间件

  static defaultCoreMiddlewaresLength = 0; // 内置内核中间件长度

  constructor(defaultMiddlewares: OnionMiddleware[]) {
    if (!Array.isArray(defaultMiddlewares)) {
      throw new TypeError('Default middlewares must be an array!');
    }
    this.defaultMiddlewares = [...defaultMiddlewares];
    this.middlewares = [];
  }
}

export default Onion;
