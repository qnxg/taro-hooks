import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { useRef, useState } from 'react';
import usePersistFn from './utils/usePersistFn';
import { getCache, setCache } from './utils/cahce';
import {
  FetchConfig,
  Service,
  Subscribe,
  FetchResult,
  OptionsWithFormat,
  BaseOptions,
  BaseResult,
  Options,
  Fetches,
} from './types';

const DEFAULT_KEY = 'QNXG_USE_API_DEFAULT_KEY';

class Fetch<R, P extends any[]> {
  config: FetchConfig<R, P>;

  // 异步函数
  service: Service<R, P>;

  // 请求时序
  count = 0;

  // 是否卸载
  unmountedFlag = false;

  // 轮询定时器
  pollingTimer: any = undefined;

  // loading 加载定时器
  loadingDelayTimer: any = undefined;

  subscribe: Subscribe<R, P>;

  that: any = this;

  state: FetchResult<R, P> = {
    loading: false,
    params: [] as any,
    data: undefined,
    error: undefined,
    run: this.run.bind(this.that),
    mutate: this.mutate.bind(this.that),
    refresh: this.refresh.bind(this.that),
    cancel: this.cancel.bind(this.that),
    unmount: this.unmount.bind(this.that),
  };

  debounceRun: any;

  throttleRun: any;

  constructor(
    service: Service<R, P>,
    config: FetchConfig<R, P>,
    subscribe: Subscribe<R, P>,
    initState?: { data?: any; error?: any; params?: any; loading?: any },
  ) {
    this.service = service;
    this.config = config;
    this.subscribe = subscribe;
    if (initState) {
      this.state = {
        ...this.state,
        ...initState,
      };
    }

    this.debounceRun = this.config.debounceInterval
      ? debounce(this._run, this.config.debounceInterval)
      : undefined;
    this.throttleRun = this.config.throttleInterval
      ? throttle(this._run, this.config.throttleInterval)
      : undefined;
  }

  // 设置状态
  setState(s = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    this.subscribe(this.state);
  }

  _run(...args: P) {
    // 取消已有定时器
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
    // 取消 loadingDelayTimer
    if (this.loadingDelayTimer) {
      clearTimeout(this.loadingDelayTimer);
    }
    this.count += 1;
    // 闭包存储当次请求的 count
    const currentCount = this.count;

    // 是否立即设置 loading
    this.setState({
      loading: !this.config.loadingDelay,
      params: args,
    });

    // loading 到时间设置状态
    if (this.config.loadingDelay) {
      this.loadingDelayTimer = setTimeout(() => {
        this.setState({
          loading: true,
        });
      }, this.config.loadingDelay);
    }

    return this.service(...args)
      .then(res => {
        // 是否本次请求
        if (!this.unmountedFlag && currentCount === this.count) {
          if (this.loadingDelayTimer) {
            clearTimeout(this.loadingDelayTimer);
          }
          // 重新格式化结果
          const formattedResult = this.config.formatResult ? this.config.formatResult(res) : res;
          this.setState({
            data: formattedResult,
            error: undefined,
            loading: false,
          });
          // 成功回调
          if (this.config.onSuccess) {
            this.config.onSuccess(formattedResult, args);
          }
          return formattedResult;
        }
      })
      .catch(error => {
        if (!this.unmountedFlag && currentCount === this.count) {
          // 清楚定时器
          if (this.loadingDelayTimer) {
            clearTimeout(this.loadingDelayTimer);
          }
          this.setState({
            data: undefined,
            error,
            loading: false,
          });
          // 执行错误回调
          if (this.config.onError) {
            this.config.onError(error, args);
          }
          console.error(error);
          return error;
        }
      })
      .finally(() => {
        // 设置轮询定时器
        if (!this.unmountedFlag && currentCount === this.count) {
          if (this.config.pollingInterval) {
            this.pollingTimer = setTimeout(() => {
              this._run(...args);
            }, this.config.pollingInterval);
          }
        }
      });
  }

  // 对外暴露的执行函数
  run(...args: P) {
    if (this.debounceRun) {
      this.debounceRun(...args);
      return;
    }
    if (this.throttleRun) {
      this.throttleRun(...args);
      return;
    }
    return this._run(...args);
  }

  // 取消请求
  cancel() {
    if (this.debounceRun) {
      this.debounceRun.cancel();
    }
    if (this.throttleRun) {
      this.throttleRun.cancel();
    }
    if (this.loadingDelayTimer) {
      clearTimeout(this.loadingDelayTimer);
    }
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }

    this.count += 1;
    this.setState({
      loading: false,
    });
  }

  // 重新刷新数据, 参数不变
  refresh() {
    this.run(...this.state.params);
  }

  // 是否进行 data 转换
  mutate(data: any) {
    if (typeof data === 'function') {
      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
        data: data(this.state.data) || {},
      });
    } else {
      this.setState({
        data,
      });
    }
  }

  // 卸载组件
  unmount() {
    this.unmountedFlag = true;
    this.cancel();
  }
}

function useAsync<R, P extends any[], U, UU extends U = any>(
  service: Service<R, P>,
  options: OptionsWithFormat<R, P, U, UU>,
): BaseResult<U, P>;
function useAsync<R, P extends any[]>(
  service: Service<R, P>,
  options?: BaseOptions<R, P>,
): BaseResult<R, P>;
function useAsync<R, P extends any[], U, UU extends U = any>(
  service: Service<R, P>,
  options?: Options<R, P, U, UU>,
): BaseResult<U, P> {
  const _options = options || ({} as Options<R, P, U, UU>);
  const {
    refreshDeps = [],
    manual = false,
    onSuccess = () => {},
    onError = () => {},

    loadingDelay,

    pollingInterval = 0,

    defaultParams = [],
    fetchKey,
    cacheKey,
    debounceInterval,
    throttleInterval,
    initialData,
  } = _options;

  const newstFetchKey = useRef(DEFAULT_KEY);
  // 持久化一些函数
  const servicePersist = usePersistFn(service) as any;

  const onSuccessPersist = usePersistFn(onSuccess);

  const onErrorPersist = usePersistFn(onError);

  const fetchKeyPersist = usePersistFn(fetchKey);

  let formatResult: any;
  if ('formatResult' in _options) {
    // eslint-disable-next-line prefer-destructuring
    formatResult = _options.formatResult;
  }
  const formatResultPersist = usePersistFn(formatResult);

  // 设置参数
  const config = {
    formatResult: formatResultPersist,
    onSuccess: onSuccessPersist,
    onError: onErrorPersist,
    loadingDelay,
    pollingInterval,
    debounceInterval,
    throttleInterval,
  };

  const subscribe = usePersistFn((key: string, data: any) => {
    setFeches((s: any) => {
      // eslint-disable-next-line no-param-reassign
      s[key] = data;
      return { ...s };
    });
  }, []) as any;

  const [fetches, setFeches] = useState<Fetches<U, P>>(() => {
    if (cacheKey) {
      const cache = getCache(cacheKey);
      if (cache) {
        newstFetchKey.current = cache.newstFetchKey;
        const newFetches: any = {};
        Object.keys(cache.fetches).forEach(key => {
          const cacheFetch = cache.fetches[key];
          const newFetch = new Fetch(servicePersist, config, subscribe.bind(null, key), {
            loading: cacheFetch.loading,
            params: cacheFetch.params,
            data: cacheFetch.data,
            error: cacheFetch.error,
          });
          newFetches[key] = newFetch.state;
        });
        return newFetches;
      }
    }
    return [];
  });
  const fetchesRef = useRef(fetches);
  fetchesRef.current = fetches;
}

//   const run = useCallback(
//     (...args: P) => {
//       if (fetchKeyPersist) {
//         const key = fetchKeyPersist(...args);
//         newstFetchKey.current = key === undefined ? DEFAULT_KEY : key;
//       }
//       const currentFetchKey = newstFetchKey.current;
//       // 这里必须用 fetchsRef，而不能用 fetches。
//       // 否则在 reset 完，立即 run 的时候，这里拿到的 fetches 是旧的。
//       let currentFetch = fetchesRef.current[currentFetchKey];
//       if (!currentFetch) {
//         const newFetch = new Fetch(servicePersist, config, subscribe.bind(null, currentFetchKey), {
//           data: initialData,
//         });
//         currentFetch = newFetch.state;
//         setFeches(s => {
//           // eslint-disable-next-line no-param-reassign
//           s[currentFetchKey] = currentFetch;
//           return { ...s };
//         });
//       }
//       return currentFetch.run(...args);
//     },
//     [fetchKey, subscribe],
//   );

//   // cache
//   useEffect(() => {
//     if (cacheKey) {
//       setCache(cacheKey, {
//         fetches,
//         newstFetchKey: newstFetchKey.current,
//       });
//     }
//   }, [cacheKey, fetches]);

//   // 第一次默认执行
//   useEffect(() => {
//     if (!manual) {
//       // 如果有缓存
//       if (Object.keys(fetches).length > 0) {
//         /* 重新执行所有的 */
//         Object.values(fetches).forEach(f => {
//           f.refresh();
//         });
//       } else {
//         // 第一次默认执行，可以通过 defaultParams 设置参数
//         run(...(defaultParams as any));
//       }
//     }
//   }, []);

//   // 重置 fetches
//   const reset = useCallback(() => {
//     Object.values(fetchesRef.current).forEach(f => {
//       f.unmount();
//     });
//     newstFetchKey.current = DEFAULT_KEY;
//     setFeches({});
//     // 不写会有问题。如果不写，此时立即 run，会是老的数据
//     fetchesRef.current = {};
//   }, [setFeches]);

//   //  refreshDeps 变化，重新执行所有请求
//   useUpdateEffect(() => {
//     if (!manual) {
//       /* 全部重新执行 */
//       Object.values(fetchesRef.current).forEach(f => {
//         f.refresh();
//       });
//     }
//   }, [...refreshDeps]);

//   // 卸载组件触发
//   useEffect(
//     () => () => {
//       Object.values(fetchesRef.current).forEach(f => {
//         f.unmount();
//       });
//     },
//     [],
//   );

//   const noReady = useCallback(
//     (name: string) => () => {
//       throw new Error(`Cannot call ${name} when service not executed once.`);
//     },
//     [],
//   );

//   return {
//     loading: !manual,
//     data: initialData,
//     error: undefined,
//     params: [],
//     cancel: noReady('cancel'),
//     refresh: noReady('refresh'),
//     mutate: noReady('mutate'),

//     ...(fetches[newstFetchKey.current] || {}),
//     run,
//     fetches,
//     reset,
//   } as BaseResult<U, P>;
// }

// export default useAsync;
