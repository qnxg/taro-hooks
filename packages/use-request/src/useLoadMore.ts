import { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { useReachBottom } from '@tarojs/taro';
import useAsync from './useAsync';
import {
  LoadMoreParams,
  LoadMoreOptionsWithFormat,
  LoadMoreResult,
  LoadMoreFormatReturn,
  LoadMoreOptions,
} from './types';
import useUpdateEffect from './utils/useUpdateEffect';

function useLoadMore<R extends LoadMoreFormatReturn, RR>(
  service: (...p: LoadMoreParams<R>) => Promise<RR>,
  options: LoadMoreOptionsWithFormat<R, RR>,
): LoadMoreResult<R>;
function useLoadMore<R extends LoadMoreFormatReturn, RR extends R>(
  service: (...p: LoadMoreParams<RR>) => Promise<R>,
  options: LoadMoreOptions<R>,
): LoadMoreResult<R>;
function useLoadMore<R extends LoadMoreFormatReturn, RR = any>(
  service: (...p: LoadMoreParams<RR>) => Promise<R>,
  options: LoadMoreOptions<R> | LoadMoreOptionsWithFormat<R, RR>,
): LoadMoreResult<R> {
  const { refreshDeps = [], isNoMore, ...restOptions } = options;
  const [loadingMore, setLoadingMore] = useState(false);

  // 判断必须有 fetchKey
  useEffect(() => {
    if (!options.fetchKey) {
      console.error('useRequest loadMore must have fetchKey!');
    }
  }, []);

  const result = useAsync(service, {
    ...(restOptions as any),
    onSuccess: (...params) => {
      setLoadingMore(false);
      if (options.onSuccess) {
        // @ts-ignore
        options.onSuccess(...params);
      }
    },
  });

  const { data, run, params, reset, loading, fetches } = result;

  const reload = useCallback(() => {
    reset();
    const [, ...restParams] = params;
    run(undefined, ...restParams);
  }, [run, reset, params]);

  const reloadRef = useRef(reload);
  reloadRef.current = reload;

  // loadMore 场景下，如果 refreshDeps 变化，重置到第一页
  useUpdateEffect(() => {
    // 只有自动执行的场景， refreshDeps 才有效
    if (!options.manual) {
      reloadRef.current();
    }
  }, [...refreshDeps]);

  const dataGroup = useMemo(() => {
    let listGroup: any[] = [];
    // 在 loadMore 时，不希望清空上一次的 data。需要把最后一个非 loading 的请求 data，放回去。
    // @ts-ignore
    let lastNoLoadingData: R | undefined = data;
    Object.values(fetches).forEach((h: any) => {
      if (h.data?.list) {
        listGroup = listGroup.concat(h.data?.list);
      }
      if (!h.loading) {
        lastNoLoadingData = h.data;
      }
    });
    return {
      ...lastNoLoadingData,
      list: listGroup,
    };
  }, [fetches, data]);

  // @ts-ignore
  const noMore = isNoMore ? !loading && !loadingMore && isNoMore(dataGroup) : false;

  const loadMore = useCallback(() => {
    if (noMore) {
      return;
    }
    setLoadingMore(true);
    const [, ...restParams] = params;
    // @ts-ignore
    run(dataGroup, ...restParams);
  }, [noMore, run, dataGroup, params]);

  useReachBottom(() => {
    loadMore();
  });

  return {
    ...result,
    // @ts-ignore
    data: dataGroup,
    reload,
    loading: loading && dataGroup.list.length === 0,
    loadMore,
    loadingMore,
    noMore,
  };
}

export default useLoadMore;
