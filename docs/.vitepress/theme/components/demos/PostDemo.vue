<template>
  <div class="demo-post">
    <div class="demo-controls">
      <button class="demo-button" @click="handleBasicPost" :disabled="loading">
        {{ loading && currentRequest === 'basic' ? '请求中...' : '基本 POST 请求' }}
      </button>
      <button class="demo-button" @click="handleConfigPost" :disabled="loading">
        {{ loading && currentRequest === 'config' ? '请求中...' : '带配置 POST 请求' }}
      </button>
    </div>

    <div class="demo-info" v-if="currentRequest">
      <div class="info-item">
        <span class="info-label">请求类型：</span>
        <span class="info-value">POST</span>
      </div>
      <div class="info-item">
        <span class="info-label">请求地址：</span>
        <span class="info-value">/api/user</span>
      </div>
      <div class="info-item">
        <span class="info-label">请求数据：</span>
        <pre class="info-value">{{ JSON.stringify(requestData, null, 2) }}</pre>
      </div>
      <div class="info-item" v-if="currentRequest === 'config'">
        <span class="info-label">请求配置：</span>
        <pre class="info-value">{{ JSON.stringify(requestConfig, null, 2) }}</pre>
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
import { jnAxiosPost, jnAxiosInit } from 'jn-axios'

// 初始化 JN-Axios
jnAxiosInit({
  // 全局请求头配置
  headers: {
    'Content-Type': 'application/json',
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
    // 在实际应用中，这里可以调用 UI 库的提示组件
    console.error('请求错误 (来自 PostDemo):', msg);
  },
});

const result = ref(null)
const error = ref(null)
const loading = ref(false)
const currentRequest = ref('')
const requestData = ref(null)
const requestConfig = ref(null)

const resetState = () => {
  result.value = null
  error.value = null
  requestData.value = null
  requestConfig.value = null
}

const handleBasicPost = async () => {
  resetState()
  loading.value = true
  currentRequest.value = 'basic'

  try {
    // 设置请求数据
    requestData.value = {
      name: '测试用户',
      email: 'test@example.com'
    }

    // 发送请求
    const res = await jnAxiosPost('/api/user', requestData.value)
    result.value = res
  } catch (err) {
    error.value = err.message || '请求失败'
  } finally {
    loading.value = false
  }
}

const handleConfigPost = async () => {
  resetState()
  loading.value = true
  currentRequest.value = 'config'

  try {
    // 设置请求数据
    requestData.value = {
      name: '测试用户',
      email: 'test@example.com'
    }

    // 设置请求配置
    requestConfig.value = {
      headers: {
        'X-Custom-Header': 'value'
      }
    }

    // 发送请求
    const res = await jnAxiosPost(
      '/api/user',
      requestData.value,
      requestConfig.value
    )
    result.value = res
  } catch (err) {
    error.value = err.message || '请求失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.demo-post {
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