# usePrevious
保存上一次渲染状态的Hook.

# 代码演示


# API
```typescript
const previousState: T = usePrevious<T>(
  state: T,
  compareFunction: (prev: T | undefined, next: T) => boolean
);
```

# 返回值

|参数|说明|类型|
|:-|:-|:-|
|previousState|上次 state 的值|T|

# 参数

|参数|说明|类型|默认值|
|:-|:-|:-|:-|
|state|需要记录的变化的值|T|-|
|compareFunction|可选，自定义值变化的规则|(prev: T \| undefined, next: T) => boolean|-|