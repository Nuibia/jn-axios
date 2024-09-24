import { Button, message } from 'antd';
import { jnAxiosGet, jnAxiosPost } from 'jn-axios';
import './App.css';

function App() {
  //接口正常
  const fetchData1 = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/200');
    if (res) {
      console.log(res);
      message.success(res.name);
    }
  };
  // 逻辑报错
  const fetchData2 = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/10001');
    if (res) {
      res.resultMsg && message.error(res.resultMsg);
    }
    console.log(res);
  };
  // 触发action的逻辑报错--如退出登录
  const fetchData3 = async () => {
    const res = await jnAxiosGet<{ name: string }>('/api/get/400');
    if (res) {
      message.success(res.name);
    }
    console.log(res);
  };
  // 触发action的逻辑报错--如退出登录
  const fetchData4 = async () => {
    const res = await jnAxiosPost<{ name: string }>('/api/post', {});
    if (res) {
      message.success(res.name);
    }
    console.log(res);
  };

  return (
    <div>
      <p>get请求</p>
      <div>
        <Button onClick={fetchData1}>正确get请求</Button>
        <Button onClick={fetchData2}>逻辑报错get请求</Button>
        <Button onClick={fetchData3}>触发action的逻辑报错-退出登录-get请求</Button>
      </div>
      <p>post请求</p>
      <Button onClick={fetchData4}>正确post请求</Button>
    </div>
  );
}

export default App;
