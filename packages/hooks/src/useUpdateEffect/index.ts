import { useEffect, useRef } from '@tarojs/taro';

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isMount = useRef(false);

  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
