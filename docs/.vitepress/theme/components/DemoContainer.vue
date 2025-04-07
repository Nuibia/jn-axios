<template>
  <div class="demo-container">
    <div class="demo-wrapper">
      <div class="demo-content">
        <slot></slot>
      </div>
    </div>
    <div class="demo-code" v-if="showCode">
      <slot name="code"></slot>
    </div>
    <div class="demo-footer">
      <button class="demo-toggle" @click="toggleCode">
        {{ showCode ? '隐藏代码' : '显示代码' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showCode = ref(false)

const toggleCode = () => {
  showCode.value = !showCode.value
}
</script>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
}

.demo-wrapper {
  padding: 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-code {
  padding: 16px;
  background-color: var(--vp-code-block-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-footer {
  padding: 8px;
  display: flex;
  justify-content: center;
}

.demo-toggle {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 4px 12px;
  background-color: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.demo-toggle:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-2);
}
</style> 