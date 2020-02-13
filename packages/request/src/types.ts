import Taro from '@tarojs/taro';
import CancelToken from './cancel/cancelToken';
import { ResponseError } from './utils';
import { ResponseInterceptor } from './interceptor';

export type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';

/**
 * 可以设置的参数
 * @param {string} method 请求的类型，默认为 'GET'
 * @param {object} params GET请求参数，类型为object对象
 * @param {any} data 'PUT', 'POST', 和 'PATCH' 请求中作为请求主体被发送的数据
 * @param {HeadersInit} headers 请求头
 * @param {number} timeout 请求超时时间, 单位为毫秒; 超过时间，请求将被中断并抛出请求异常
 * @param {string} prefix 前缀，统一设置 url 前缀
 * ( e.g. request('/user/save', { prefix: '/api/v1' }) => request('/api/v1/user/save') )
 * @param {string} suffix 后缀，统一设置 url 后缀
 * ( e.g. request('/api/v1/user/save', { suffix: '.json'}) => request('/api/v1/user/save.json') )
 * @param {string} credentials 跨域cookie的设置
 * @param {boolean} useCache 是否使用缓存, 当值为 true 时，GET 请求在 ttl 毫秒内将被缓存，缓存策略唯一 key 为 url + params + method 组合
 * @param {number} ttl 缓存时长(毫秒), 0 为不过期
 * @param {number} maxCache 最大缓存数, 0 为无限制
 * @todo Cache 尚未完成上面三个参数无效
 * @param {function} validateCache 供用户自定义何时需要进行缓存
 *  ( e.g. (url, options) => { return options.method.toLowerCase() === 'get' } )
 * @param {string} requestType 默认为 JSON, 需要上传文件时, 请指定为 form
 * @param {string} formKey 指定发送文件的formKey(当requestType为form时指定), 默认为 file
 * @param {string} responseType 返回数据的类型
 * @param {boolean} getResponse 是否获取源 Response
 * @param {function} errorHandler 统一的异常处理，供开发者对请求发生的异常做统一处理
 * @param {CancelToken} 取消请求的 Token, 因为小程序 API 会出现问题, 所以改为不返回任何数据
 */
export interface RequestOptionsInit extends RequestInit {
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
  params?: object;
  data?: any;
  timeout?: number;
  prefix?: string;
  suffix?: string;
  useCache?: boolean;
  ttl?: number;
  maxCache?: number;
  validateCache?: (url: string, options: RequestOptionsInit) => boolean;
  requestType?: 'json' | 'form';
  formKey?: string;
  responseType?: ResponseType;
  getResponse?: boolean;
  errorHandler?: (error: ResponseError) => void;
  cancelToken?: CancelToken;
  __umiRequestCoreType__?: string;
}

export interface Req {
  url: string;
  options: RequestOptionsInit;
}

// 请求上下文
export interface Context {
  req: Req;
  res: any;
  responseInterceptors: ResponseInterceptor[];
}

export interface RequestOptionsWithResponse extends RequestOptionsInit {
  getResponse: true;
}

export interface RequestOptionsWithoutResponse extends RequestOptionsInit {
  getResponse: false;
}

export type RequestResponse<T = any> = {
  data: T;
  response: Taro.request.Promised<T>;
};
