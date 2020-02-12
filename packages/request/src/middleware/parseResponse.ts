import { ResponseError, RequestError } from '../utils';
import { OnionMiddleware } from '../onion';

const parseResponseMiddleware: OnionMiddleware = (ctx, next) => {
  // 后置中间件
  next();

  try {
    if (!ctx) return;
    const { res, req } = ctx;
    const { options: { getResponse = false } = {} } = req;

    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (getResponse) {
        ctx.res = { data: res.data, response: res };
      }
      ctx.res = res.data;
    }

    throw new ResponseError(res, 'http error', res.data, req, 'HttpError');
  } catch (err) {
    if (err instanceof RequestError || err instanceof ResponseError) {
      throw err;
    }
    // 对未知错误进行处理
    const { req, res } = ctx;
    err.request = req;
    err.response = res;
    err.type = err.name;
    err.data = undefined;
    throw err;
  }
};

export default parseResponseMiddleware;
