import { useCallback, useRef, useEffect, DependencyList } from 'react';

function usePersistFn(fn: any, dependencies: DependencyList = []) {
  const ref = useRef<any>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  const persist = useCallback(
    (...args) => {
      const fnCurrent = ref.current;
      if (fnCurrent) {
        return fnCurrent(...args);
      }
    },
    [ref],
  );

  if (typeof fn === 'function') {
    return persist;
  }
  return undefined;
}

export default usePersistFn;
