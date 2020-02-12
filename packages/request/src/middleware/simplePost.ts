import { OnionMiddleware } from '../onion';

const simplePostMiddleware: OnionMiddleware = (ctx, next) => {
  if (!ctx) {
    return next();
  }
  const { req: { options = {} } = {} } = ctx;
  const { method = 'get' } = options;

  // GET 请求不执行此中间件
  if (['post', 'put', 'patch', 'delete'].indexOf(method.toLowerCase()) === -1) {
    return next();
  }

  const { requestType = 'json', data } = options;
  // 判断 data 是否存在
  if (data) {
    const dataType = Object.prototype.toString.call(data);
    // 根据 data 类型判断要添加的请求头, 与 umi-request 不同的是不需要对data进行编码操作
    if (dataType === '[object Object]' || dataType === '[object Array]') {
      if (requestType === 'json') {
        options.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          ...options.headers,
        };
      } else if (requestType === 'form') {
        options.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          ...options.headers,
        };
      }
    } else {
      // 其他 requestType 自定义header
      options.headers = {
        Accept: 'application/json',
        ...options.headers,
      };
    }
  }

  // 将操作之后的 options 挂载到上下文
  ctx.req.options = options;

  return next();
};

export default simplePostMiddleware;
