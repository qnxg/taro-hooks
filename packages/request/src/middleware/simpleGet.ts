import { OnionMiddleware } from '../onion';
import { isArray, forEach2ObjArr, isObject, reqStringify, isDate } from '../utils';

/**
 * 自动拼接参数
 * @param params
 */
export function paramsSerialize(params: object | undefined) {
  let serializedParams: string | undefined;
  let jsonStringifiedParams: any;

  if (params) {
    if (isArray(params)) {
      jsonStringifiedParams = [];
      forEach2ObjArr(params, (item: any) => {
        if (item === null || typeof item === 'undefined') {
          jsonStringifiedParams.push(item);
        } else {
          jsonStringifiedParams.push(isObject(item) ? JSON.stringify(item) : item);
        }
      });
      serializedParams = reqStringify(jsonStringifiedParams);
    } else {
      jsonStringifiedParams = {};
      forEach2ObjArr(params, (value: any, key: any) => {
        let jsonStringifiedValue = value;
        if (value === null || typeof value === 'undefined') {
          jsonStringifiedParams[key] = value;
        } else if (isDate(value)) {
          jsonStringifiedValue = value.toISOString();
        } else if (isArray(value)) {
          jsonStringifiedValue = value;
        } else if (isObject(value)) {
          jsonStringifiedValue = JSON.stringify(value);
        }
        jsonStringifiedParams[key] = jsonStringifiedValue;
      });

      const tmp = reqStringify(jsonStringifiedParams);
      serializedParams = tmp;
    }
  }

  return serializedParams;
}

const simpleGetMiddleware: OnionMiddleware = (ctx, next) => {
  if (!ctx) {
    return next();
  }

  const { req: { options = {} } = {} } = ctx;
  const { params } = options;
  const { req: { url = '' } = {} } = ctx;

  options.method = options.method ? options.method.toUpperCase() : 'GET';

  // 跨域cookie的指定
  options.credentials = options.credentials || 'same-origin';

  // 拼装URL
  const serializedParams = paramsSerialize(params);
  if (serializedParams) {
    const urlSign = url.indexOf('?') !== -1 ? '&' : '?';
    ctx.req.url = `${url}${urlSign}${serializedParams}`;
  }

  ctx.req.options = options;

  return next();
};

export default simpleGetMiddleware;
