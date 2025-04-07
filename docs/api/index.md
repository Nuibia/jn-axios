# API 参考

## 全局配置

JN-Axios 提供了一个全局配置函数 `jnAxiosInit`，用于设置库的全局行为。

### jnAxiosInit 配置选项

```typescript
interface IDiyAxiosInitConfigInterface {
  /** 全局默认的请求头配置 */
  headers?: Record<string, string>;

  /** 接口请求成功业务正常返回的 code, 默认 200 */
  successCode?: number | number[];

  /** 接口异常的提示，默认「系统开小差了，请稍后重试」 */
  exceptionMsg?: string;

  /** 排除非 200 处理接口的异常 code 过滤处理 */
  expectCodeList: number[];

  /** 接口 40x, 50x, code 非 200 和不在 expectCodeList 列表的回调处理 */
  exceptionCallBack: (msg: string, error: AxiosError | typeDiyAxiosResponse) => void;

  /** 添加一些对 header 的额外限制 */
  extraHeader?: any;
}
```

### 配置项说明

#### headers

- 类型：`Record<string, string>`
- 默认值：`{}`
- 说明：全局默认的请求头配置，会与每个请求的 headers 合并

```typescript
jnAxiosInit({
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
  },
});
```

#### successCode

- 类型：`number | number[]`
- 默认值：`200`
- 说明：定义接口请求成功的业务状态码

```typescript
jnAxiosInit({
  // 单个状态码
  successCode: 200,
  // 或者多个状态码
  successCode: [200, 0],
});
```

#### exceptionMsg

- 类型：`string`
- 默认值：`'系统开小差了，请稍后重试'`
- 说明：全局默认的异常提示信息

```typescript
jnAxiosInit({
  exceptionMsg: '网络请求失败，请稍后重试',
});
```

#### expectCodeList

- 类型：`number[]`
- 必填
- 说明：需要特殊处理的非成功状态码列表

```typescript
jnAxiosInit({
  expectCodeList: [401, 403],
});
```

#### exceptionCallBack

- 类型：`(msg: string, error: AxiosError | typeDiyAxiosResponse) => void`
- 必填
- 说明：异常情况的回调处理函数

```typescript
jnAxiosInit({
  exceptionCallBack: (msg, error) => {
    if (error.response?.status === 401) {
      // 处理未授权
      redirectToLogin();
    } else {
      // 显示错误信息
      showErrorMessage(msg);
    }
  },
});
```

#### extraHeader

- 类型：`any`
- 可选
- 说明：用于添加特殊的请求头处理逻辑

```typescript
jnAxiosInit({
  extraHeader: {
    csrfToken: ['api/v1/*', 'api/v2/*'],
  },
});
```

## 响应数据类型

### IDiyAxiosResponseData

接口返回数据的标准格式：

```typescript
interface IDiyAxiosResponseData<T = any> {
  /** 业务状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message?: string;
  /** 结果消息 */
  resultMsg?: string;
  /** 请求 ID */
  requestId?: string;
}
```

### typeDiyAxiosResponse

完整的响应类型：

```typescript
type typeDiyAxiosResponse<T = any> = AxiosResponse<IDiyAxiosResponseData<T>> | false;
```
