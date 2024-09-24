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
    response: {
      code: 200,
      data: {
        name: 'vben',
      },
    },
  },
] as MockMethod[];
