---
title: useUpdateLayoutEffect
group:
  title: LifeCycle
  path: /lifeCycle
  order: 600
---

# useUpdateLayoutEffect

一个只在依赖更新时执行的 useLayoutEffect Hook。

## 代码演示

### 基础使用

``` jsx | pure
import Taro, { useLayoutEffect, useState } from '@tarojs/taro';
import { Button, View, Text } from '@tarojs/components';
import { useUpdateLayoutEffect } from '@qnxg/hooks';

export default () => {
  const [count, setCount] = useState(0);
  const [effectCount, setEffectCount] = useState(0);
  const [updateEffectCount, setUpdateEffectCount] = useState(0);

  useLayoutEffect(() => {
    setEffectCount(c => c + 1);
  }, [count]);

  useUpdateLayoutEffect(() => {
    setUpdateEffectCount(c => c + 1);
    return () => {
      // do something
    };
  }, [count]); // you can include deps array if necessary

  return (
    <View>
      <Text>effectCount: {effectCount}</Text>
      <Text>updateEffectCount: {updateEffectCount}</Text>
      <Text>
        <Button type="primary" onClick={() => setCount(c => c + 1)}>
          reRender
        </Button>
      </Text>
    </View>
  );
};
```

## API

```javascript
useUpdateLayoutEffect(
  effect: () => (void | (() => void | undefined)),
  deps?: deps,
)
```

### 参数

| 参数    | 说明                                         | 类型                   | 默认值 |
|---------|----------------------------------------------|------------------------|--------|
| effect | 可执行函数  | () => (void \| (() => void \| undefined)) | -      |
| deps | 可选项，传入依赖变化的对象  | array \| undefined | -      |