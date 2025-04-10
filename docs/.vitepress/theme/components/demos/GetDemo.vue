<template>
  <div class="demo-get">
    <div class="demo-controls">
      <button class="demo-button" @click="handleBasicGet" :disabled="loading">
        {{ loading && currentRequest === 'basic' ? '请求中...' : '基本 GET 请求' }}
      </button>
      <button class="demo-button" @click="handleParamsGet" :disabled="loading">
        {{ loading && currentRequest === 'params' ? '请求中...' : '带参数 GET 请求' }}
      </button>
    </div>

    <div class="demo-info" v-if="currentRequest">
      <div class="info-item">
        <span class="info-label">请求类型：</span>
        <span class="info-value">GET</span>
      </div>
      <div class="info-item">
        <span class="info-label">请求地址：</span>
        <span class="info-value">{{ currentRequest === 'basic' ? '/api/user' : '/api/users' }}</span>
      </div>
      <div class="info-item" v-if="currentRequest === 'params'">
        <span class="info-label">请求参数：</span>
        <pre class="info-value">{{ JSON.stringify(requestParams, null, 2) }}</pre>
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
import { jnAxiosGet, jnAxiosInit } from 'jn-axios'

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
    console.error('请求错误 (来自 GetDemo):', msg);
  },
});

const result = ref(null)
const error = ref(null)
const loading = ref(false)
const currentRequest = ref('')
const requestParams = ref(null)

const resetState = () => {
  result.value = null
  error.value = null
  requestParams.value = null
}

const handleBasicGet = async () => {
  resetState()
  loading.value = true
  currentRequest.value = 'basic'

  try {
    // 发送请求
    const res = await jnAxiosGet('/api/user')
    result.value = res
  } catch (err) {
    error.value = err.message || '请求失败'
  } finally {
    loading.value = false
  }
}

const handleParamsGet = async () => {
  resetState()
  loading.value = true
  currentRequest.value = 'params'

  try {
    // 设置请求参数
    requestParams.value = {
      page: 1,
      size: 10
    }

    // 发送请求
    const res = await jnAxiosGet('/api/users', {
      params: requestParams.value
    })
    result.value = res
  } catch (err) {
    error.value = err.message || '请求失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.demo-get {
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