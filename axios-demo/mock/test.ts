import { MockMethod } from 'vite-plugin-mock';
export default [
  {
    url: '/api/get/200',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 200,
        data: {
          name: 'vben',
        },
      };
    },
  },
  {
    url: '/api/get/10001',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 10001,
        data: {
          name: 'vben',
        },
        resultMsg: '特殊逻辑报错10001',
      };
    },
  },
  {
    url: '/api/get/400',
    method: 'get',
    response: ({ query }) => {
      return {
        code: 400,
        data: {
          name: 'vben',
        },
      };
    },
  },
  {
    url: '/api/post',
    method: 'post',
    timeout: 2000,
    response: {
      code: 0,
      data: {
        name: 'vben',
      },
    },
  },
  {
    url: '/api/text',
    method: 'post',
    rawResponse: async (req, res) => {
      let reqbody = '';
      await new Promise(resolve => {
        req.on('data', chunk => {
          reqbody += chunk;
        });
        req.on('end', () => resolve(undefined));
      });
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 200;
      res.end(`hello, ${reqbody}`);
    },
  },
] as MockMethod[];
