<template>
  <div class="demo-error-handling">
    <div class="demo-controls">
      <button class="demo-button" @click="handleBusinessError">触发业务错误</button>
      <button class="demo-button" @click="handleSpecialCode">触发特殊状态码</button>
      <button class="demo-button" @click="handleNetworkError">触发网络错误</button>
    </div>
    <div class="demo-result" v-if="result">
      <div class="result-title">请求结果：</div>
      <pre class="result-content">{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const result = ref(null)

// 模拟请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const handleBusinessError = async () => {
  try {
    await delay(500)
    result.value = {
      code: 10001,
      data: null,
      message: '业务逻辑错误：用户未找到'
    }
  } catch (error) {
    result.value = { error: error.message }
  }
}

const handleSpecialCode = async () => {
  try {
    await delay(500)
    result.value = {
      code: 400,
      data: null,
      message: '用户已退出登录'
    }
  } catch (error) {
    result.value = { error: error.message }
  }
}

const handleNetworkError = async () => {
  try {
    await delay(500)
    throw new Error('网络连接失败')
  } catch (error) {
    result.value = { 
      code: -1,
      error: error.message,
      message: '网络请求失败，请检查网络连接'
    }
  }
}
</script>

<style scoped>
.demo-error-handling {
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
}

.demo-button:hover {
  opacity: 0.9;
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
</style> 