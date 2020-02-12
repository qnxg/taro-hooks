import { Context } from '../types';
import compose from './compose';

export type OnionMiddleware = (ctx: Context, next: () => void) => void;
export type OnionOptions = { global?: boolean; core?: boolean; defaultInstance?: boolean };

class Onion {
  defaultMiddlewares: OnionMiddleware[];

  middlewares: OnionMiddleware[];

  static globalMiddlewares: OnionMiddleware[] = []; // 全局中间件

  static defaultGlobalMiddlewaresLength = 0; // 内置全局中间件长度

  static coreMiddlewares: OnionMiddleware[] = []; // 内核中间件

  static defaultCoreMiddlewaresLength = 0; // 内置内核中间件长度

  constructor(defaultMiddlewares: OnionMiddleware[]) {
    if (!Array.isArray(defaultMiddlewares)) {
      throw new TypeError('Default middlewares must be an array!');
    }
    this.defaultMiddlewares = [...defaultMiddlewares];
    this.middlewares = [];
  }

  // 添加中间件
  use(
    newMiddleware: OnionMiddleware,
    opts: OnionOptions = { global: false, core: false, defaultInstance: false },
  ) {
    let core = false;
    let global = false;
    let defaultInstance = false;

    if (typeof opts !== 'object') {
      throw new TypeError('use() options should be object');
    } else if (typeof opts === 'object' && opts) {
      global = opts.global || false;
      core = opts.core || false;
      defaultInstance = opts.defaultInstance || false;
    }

    // 全局中间件
    if (global) {
      Onion.globalMiddlewares.splice(
        Onion.globalMiddlewares.length - Onion.defaultGlobalMiddlewaresLength,
        0,
        newMiddleware,
      );
      return;
    }

    // 内核中间件
    if (core) {
      Onion.coreMiddlewares.splice(
        Onion.coreMiddlewares.length - Onion.defaultCoreMiddlewaresLength,
        0,
        newMiddleware,
      );
    }

    // 默认实例中间件
    if (defaultInstance) {
      this.defaultMiddlewares.push(newMiddleware);
    }

    // 实例中间件
    this.middlewares.push(newMiddleware);
  }

  // 执行所有的中间件
  execute(params: any = null) {
    const fn = compose([
      ...this.middlewares,
      ...this.defaultMiddlewares,
      ...Onion.globalMiddlewares,
      ...Onion.coreMiddlewares,
    ]);
    return fn(params);
  }
}

export default Onion;
