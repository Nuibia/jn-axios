import { message } from 'antd';
import { jnAxiosInit } from 'jn-axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const EXPECT_CODE_LIST = [10001];

jnAxiosInit({
  headers: {},
  successCode: 200,
  exceptionMsg: '服务异常，请稍后',
  expectCodeList: EXPECT_CODE_LIST,
  exceptionCallBack: function (msg, error) {
    if (!error) return;
    if ('data' in error) {
      if (error.data.code === 400) {
        message.info('成功退出登录');
        return;
      }
    }
    if ('isAxiosError' in error) {
      message.error(msg);
    }
    console.log(this);
  },
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
