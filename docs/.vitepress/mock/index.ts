import { createServer } from 'miragejs';

export function startMockServer() {
  return createServer({
    routes() {
      this.namespace = 'api';

      // GET 请求 - 成功
      this.get('/get/200', () => {
        return {
          code: 200,
          data: {
            name: '请求成功',
            message: '这是一个成功的 GET 请求',
          },
        };
      });

      // GET 请求 - 业务错误
      this.get('/get/10001', () => {
        return {
          code: 10001,
          data: null,
          message: '业务逻辑错误',
        };
      });

      // GET 请求 - 特殊状态码
      this.get('/get/400', () => {
        return {
          code: 400,
          data: null,
          message: '退出登录',
        };
      });

      // POST 请求 - 成功
      this.post('/post', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return {
          code: 200,
          data: {
            id: Math.floor(Math.random() * 1000),
            ...attrs,
          },
        };
      });

      // 用户相关接口
      this.get('/user/:id', (schema, request) => {
        const id = request.params.id;
        return {
          code: 200,
          data: {
            id: parseInt(id),
            name: '测试用户',
            email: 'test@example.com',
          },
        };
      });

      this.get('/users', (schema, request) => {
        const { page = 1, size = 10 } = request.queryParams;
        return {
          code: 200,
          data: {
            total: 100,
            list: Array.from({ length: size }, (_, i) => ({
              id: (page - 1) * size + i + 1,
              name: `用户${(page - 1) * size + i + 1}`,
              email: `user${(page - 1) * size + i + 1}@example.com`,
            })),
          },
        };
      });

      this.post('/user', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return {
          code: 200,
          data: {
            id: Math.floor(Math.random() * 1000),
            ...attrs,
          },
        };
      });
    },
  });
}
