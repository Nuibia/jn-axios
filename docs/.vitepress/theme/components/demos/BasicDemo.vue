<template>
  <div class="demo-basic">
    <div class="demo-controls">
      <button class="demo-button" @click="handleGet" :disabled="loading">
        {{ loading && currentRequest === 'GET' ? '请求中...' : '发送 GET 请求' }}
      </button>
      <button class="demo-button" @click="handlePost" :disabled="loading">
        {{ loading && currentRequest === 'POST' ? '请求中...' : '发送 POST 请求' }}
      </button>
    </div>

    <div class="demo-info" v-if="currentRequest">
      <div class="info-item">
        <span class="info-label">请求类型：</span>
        <span class="info-value">{{ currentRequest }}</span>
      </div>
      <div class="info-item" v-if="requestData">
        <span class="info-label">请求数据：</span>
        <pre class="info-value">{{ JSON.stringify(requestData, null, 2) }}</pre>
      </div>
      <div class="info-item">
        <span class="info-label">请求地址：</span>
        <span class="info-value">{{ currentRequest === 'GET' ? '/api/get/200' : '/api/post' }}</span>
      </div>
    </div>

    <div class="demo-result" v-if="result">
      <div class="result-title">请求结果：</div>
      <pre class="result-content">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>

    <div class="demo-error" v-if="error">
      <div class="error-title">错误信息：</div>
      <pre class="error-content">{{ error }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { jnAxiosGet, jnAxiosPost, jnAxiosInit } from 'jn-axios'

// 初始化 JN-Axios
jnAxiosInit({
  // 全局请求头配置
  headers: {
  },
  // 成功状态码
  successCode: 200,
  // 异常提示信息
  exceptionMsg: '服务异常，请稍后重试',
  // 特殊状态码列表
  expectCodeList: [10001],
  // 异常回调处理
  exceptionCallBack: function (msg, error) {
    if (!error) return;
    console.error('请求错误:', msg);
  },
});

const result = ref(null)
const error = ref(null)
const loading = ref(false)
const currentRequest = ref('')
const requestData = ref(null)

// // 模拟请求延迟 - 不再需要
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const resetState = () => {
  result.value = null
  error.value = null
  requestData.value = null
}

const handleGet = async () => {
  resetState()
  loading.value = true
  currentRequest.value = 'GET'

  try {
    // // 模拟请求延迟 - 不再需要
    // await delay(500)

    // // 模拟成功响应 - 不再需要
    // result.value = {
    //   code: 200,
    //   data: {
    //     message: 'GET 请求成功',
    //     timestamp: new Date().toISOString()
    //   }
    // }

    // 发送实际 GET 请求
    const res = await jnAxiosGet('/api/get/200');
    result.value = res;

  } catch (err) { // 使用 err 捕获错误
    error.value = err.message || '请求失败' // 使用 err.message
  } finally {
    loading.value = false
  }
}

const handlePost = async () => {
  resetState()
  loading.value = true
  currentRequest.value = 'POST'

  try {
    // 设置请求数据
    requestData.value = {
      name: '测试用户',
      email: 'test@example.com'
    }

    // // 模拟请求延迟 - 不再需要
    // await delay(500)

    // // 模拟成功响应 - 不再需要
    // result.value = {
    //   code: 200,
    //   data: {
    //     message: 'POST 请求成功',
    //     ...requestData.value,
    //     timestamp: new Date().toISOString()
    //   }
    // }

    // 发送实际 POST 请求
    const res = await jnAxiosPost('/api/post', requestData.value);
    result.value = res;

  } catch (err) { // 使用 err 捕获错误
    error.value = err.message || '请求失败' // 使用 err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.demo-basic {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-controls {
  display: flex;
  gap: 12px;
}

.demo-button {
  padding: 8px 16px;
  border: 1px solid var(--vp-c-brand);
  border-radius: 4px;
  background-color: var(--vp-c-brand);
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.demo-button:hover:not(:disabled) {
  opacity: 0.9;
}

.demo-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-info {
  padding: 12px;
  background-color: var(--vp-code-block-bg);
  border-radius: 4px;
  font-size: 14px;
}

.info-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.info-label {
  color: var(--vp-c-text-2);
  min-width: 80px;
}

.info-value {
  color: var(--vp-c-text-1);
  margin: 0;
  font-family: monospace;
}

.demo-result {
  padding: 16px;
  background-color: var(--vp-code-block-bg);
  border-radius: 4px;
}

.result-title {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}

.result-content {
  margin: 0;
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
  color: var(--vp-c-text-1);
}

.demo-error {
  padding: 16px;
  background-color: var(--vp-c-danger-soft);
  border-radius: 4px;
}

.error-title {
  font-size: 14px;
  color: var(--vp-c-danger);
  margin-bottom: 8px;
}

.error-content {
  margin: 0;
  font-family: monospace;
  font-size: 14px;
  white-space: pre-wrap;
  color: var(--vp-c-danger);
}
</style>