<template>
  <div class="demo-basic">
    <div class="demo-controls">
      <button class="demo-button" @click="handleGet">发送 GET 请求</button>
      <button class="demo-button" @click="handlePost">发送 POST 请求</button>
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

const handleGet = async () => {
  try {
    // 模拟请求延迟
    await delay(500)
    
    // 模拟成功响应
    result.value = {
      code: 200,
      data: {
        name: '请求成功',
        message: '这是一个成功的 GET 请求示例',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    result.value = { error: error.message }
  }
}

const handlePost = async () => {
  try {
    // 模拟请求延迟
    await delay(500)
    
    // 模拟请求数据
    const requestData = {
      name: '测试用户',
      email: 'test@example.com'
    }
    
    // 模拟成功响应
    result.value = {
      code: 200,
      data: {
        id: Math.floor(Math.random() * 1000),
        ...requestData,
        createdAt: new Date().toISOString()
      }
    }
  } catch (error) {
    result.value = { error: error.message }
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