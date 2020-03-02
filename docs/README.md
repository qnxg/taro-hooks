# @qnxg/hooks

Taro Hooks And Request Library.

## 📚 文档

* 采用`father-doc`生成
* [文档](https://qnxg.github.io/taro-hooks/#/)

## ✨ 特性

* 采用洋葱圈模型，直线类似 axios 和 umi-request 类似的接口
* 统一 request 和 uploadfile 接口
* hooks 基本同步自 @umijs/hooks ，并添加小程序个性的hooks
* 易学易用
* 包含大量提炼自应用的高级 Hooks。
* 包含丰富的基础 Hooks。
* 使用 TypeScript 构建，提供完整的类型定义文件。

## 📣 说明

**对 Taro 的 Hooks 功能进行拓展，请结合 Taro3.x 进行使用。**


## 📦 安装

```shell
# hooks
$ npm install @qnxg/hooks
$ yarn add @qnxg/hooks

# request
$ npm install @qnxg/request
$ yarn add @qnxg/request
```

## 🔨使用

```js
import { useUpdateEffect } from '@qnxg/hooks';

// or

import request from '@qnxg/request'
```

## 🖥 开发

```
$ git clone git@github.com:qnxg/taro-hooks.git
$ cd taro-hooks
$ npm run init
$ npm start
```
打开浏览器访问 http://127.0.0.1:8000

## 🤝 贡献

我们欢迎所有人参与共建，请参考[CONTRIBUTING.MD](https://github.com/umijs/hooks/blob/master/CONTRIBUTING.MD)

## 👥 讨论

欢迎大家提交 issue参与共建

## ✅ License

[MIT](https://github.com/qnxg/taro-hooks/blob/master/LICENSE)