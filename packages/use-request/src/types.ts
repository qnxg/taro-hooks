import { DependencyList } from 'react';

export type noop = (...args: any[]) => void;

export type Service<R, P extends any[]> = (...args: P) => Promise<R>;

export type Subscribe<R, P extends any[]> = (data: FetchResult<R, P>) => void;
export type Mutate<R> = (x: R | ((data: R) => R)) => void;

export interface FetchConfig<R, P extends any[]> {
  // 防抖时间
  debounceInterval?: number;
  // 节流时间
  throttleInterval?: number;

  // loading延迟时间
  loadingDelay?: number;

  // 重新格式化结果函数
  formatResult?: (res: any) => R;

  onSuccess?: (data: R, params: P) => void;
  onError?: (e: Error, params: P) => void;

  // 轮询
  pollingInterval?: number; // 轮询的间隔毫秒
}

export interface FetchResult<R, P extends any[]> {
  loading: boolean;
  data: R | undefined;
  error: Error | undefined;
  params: P;
  cancel: noop;
  refresh: noop;
  mutate: Mutate<R>;
  run: (...args: P) => void | Promise<R>;
  unmount: () => void;
}

export interface Fetches<R, P extends any[]> {
  [key: string]: FetchResult<R, P>;
}

export interface BaseResult<R, P extends any[]> extends FetchResult<R, P> {
  reset: () => void;
  fetches: {
    [key in string]: FetchResult<R, P>;
  };
}

export type BaseOptions<R, P extends any[]> = {
  refreshDeps?: DependencyList; // 如果 deps 变化后，重新请求
  manual?: boolean; // 是否需要手动触发
  onSuccess?: (data: R, params: P) => void; // 成功回调
  onError?: (e: Error, params: P) => void; // 失败回调

  loadingDelay?: number; // loading delay

  defaultParams?: P;
  // 轮询
  pollingInterval?: number; // 轮询的间隔毫秒

  fetchKey?: (...args: P) => string;

  paginated?: false;
  loadMore?: false;

  cacheKey?: string;

  debounceInterval?: number;
  throttleInterval?: number;

  initialData?: R;

  requestMehod?: (service: any) => Promise<any>;
};

export type OptionsWithFormat<R, P extends any[], U, UU extends U> = {
  formatResult: (res: R) => U;
} & BaseOptions<UU, P>;

export type Options<R, P extends any[], U, UU extends U> =
  | BaseOptions<R, P>
  | OptionsWithFormat<R, P, U, UU>;
