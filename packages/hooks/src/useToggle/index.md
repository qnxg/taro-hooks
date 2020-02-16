# useToggle 

一个在两种状态相互切换的Hook.

# 例子

# API
```typescript
const {
  state, 
  toggle,
  setLeft,
  setRight
} = useToggle(
  defaultValue?: boolean,
);

const {
  state, 
  toggle,
  setLeft,
  setRight
} = useToggle(
  defaultValue: any = false,
  reverseValue?: any,
);
```

# 返回值
| 参数     | 说明                                               | 类型                                                    |
| :------- | :------------------------------------------------- | :------------------------------------------------------ |
| state    | 状态值                                             | boolean                                                 |
| toggle   | 触发状态改变的函数，可以接受两个可选参数修改状态值 | (defaultValue: any = false, reverseValue?: any) => void |
| setLeft  | 设置为默认值                                       | () => void                                              |
| setRight | 设置为相反值                                       | () => void                                              |

# 参数

| 参数 | 说明 | 类型 | 默认值 |
|:-|:-|:-|:-|
|defaultValue	|可选项，传入默认的状态值	|number \| string \| boolean \| undefined	|false|
|reverseValue|	可选项，传入取反的状态值	|number \| string \| boolean \| undefined	|--|
