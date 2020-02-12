import { OnionMiddleware } from './index';
import { Context } from '../types';

// 返回一个组合了所有插件的“插件”

export default function compose(middlewares: OnionMiddleware[]) {
  // 判断中间件类型是否正确
  if (!Array.isArray(middlewares)) {
    throw new TypeError('Middlewares must be an array!');
  }

  const middlewaresLen = middlewares.length;
  for (let i = 0; i < middlewaresLen; ++i) {
    if (typeof middlewares[i] !== 'function') {
      throw new TypeError('Middleware must be componsed of function');
    }
  }

  return function wrapMiddlewares(params: Context, next?: () => void) {
    // 组合所有中间件
    let index = -1;
    function dispath(i: number): any {
      if (i <= index) {
        return Promise.reject(
          new Error('next() should not be called multiple times in one middleware!'),
        );
      }
      index = i;
      const fn = middlewares[i] || next;
      if (!fn) {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(fn(params, () => dispath(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return dispath(0);
  };
}
