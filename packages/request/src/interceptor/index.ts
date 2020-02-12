import Taro from '@tarojs/taro';
import { RequestOptionsInit } from '../types';

export type RequestInterceptor = (
  url: string,
  options: RequestOptionsInit,
) => {
  url?: string;
  options?: RequestOptionsInit;
};

export type ResponseInterceptor = (
  response: Taro.request.SuccessCallbackResult,
  options: RequestOptionsInit,
) => Response | Promise<Response>;
