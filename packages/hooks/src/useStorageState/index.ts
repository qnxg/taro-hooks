import Taro, { useState } from '@tarojs/taro';

interface IFuncUpdater<T> {
  (previousState?: T): T;
}

function isFunction<T>(obj: any): obj is T {
  return typeof obj === 'function';
}

function useStorageState<T>(key: string, defaultValue?: T | IFuncUpdater<T>) {
  const [state, setState] = useState<T | undefined>(() => getStoredValue());

  // 同步获取 Storage 中的值
  function getStoredValue() {
    const raw = Taro.getStorageSync(key);
    if (raw) {
      return JSON.parse(raw);
    }
    if (isFunction<IFuncUpdater<T>>(defaultValue)) {
      return defaultValue();
    }
    return defaultValue;
  }

  function updateState(value?: T | IFuncUpdater<T>) {
    if (typeof value === 'undefined') {
      Taro.removeStorageSync(key);
      setState(defaultValue);
    } else if (isFunction<IFuncUpdater<T>>(value)) {
      // 如果 value 是个 update Function
      const previousState = getStoredValue();
      const currentState = value(previousState);
      Taro.setStorageSync(key, JSON.stringify(currentState));
      setState(currentState);
    } else {
      Taro.setStorageSync(key, JSON.stringify(value));
      setState(value);
    }
  }
  // 返回一个用于更新 State 和 Storage 的值得函数
  return [state, updateState];
}

export default useStorageState;
