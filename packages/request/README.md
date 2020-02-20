---
title: request
group:
  title: Request
  path: /request
  order: 1000
---

## @qnxg/request

网络请求库，基于 `@tarojs/taro` 进行封装，api 的封装上，具有 fetch 的与 axios 的特点。为大家提供一个在小程序中统一的 api 调用方式，简化使用；并且提供缓存（待做）、超时（因小程序 api 经常出现问题，所以自己实现了一个方法）、错误处理等常用功能。

![Deploy Doc Site](https://github.com/qnxg/taro-hooks/workflows/Deploy%20Doc%20Site/badge.svg)  ![Node.js CI](https://github.com/qnxg/taro-hooks/workflows/Node.js%20CI/badge.svg)  [![npm version](https://badge.fury.io/js/%40qnxg%2Frequest.svg)](https://badge.fury.io/js/%40qnxg%2Frequest)

---

### 支持的功能

- url 参数自动序列化
- post 数据提交方式简化
- form 提交方式统一封装为 post 请求
- response 返回处理简化
- api 超时支持
- 类 axios 的 request 和 response 拦截器(interceptors)支持
- 统一的错误处理方式
- 类 koa 洋葱机制的 use 中间件机制支持
- 类 axios 的取消请求

### TODO 欢迎 PR

- api 请求缓存支持
- api 支持 GBK 编码
- 完善测试文件
- 编写 demo 项目

### 安装

``` shell
# npm
$ npm install @qnxg/request

# or yarn
$ yarn add @qnxg/request
```

### 快速上手

#### 执行 GET 请求

``` js
import request from '@qnxg/request';

request
  .get('/api/v1/xxx?id=1')
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });

// 将请求参数放在 params 选项中
request
  .get('/api/v1/xxx', {
    params: {id: 1},
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
```



### request APIs

### 代码贡献者

- [@ Derek Wang](https://github.com/wangjq4214)
- [@ qkuns](https://github.com/qkuns)

### 致谢

- [umi-request](https://github.com/umijs/umi-request)

