<template>
  <span class="copy-path-wrapper">
    <code class="path-text">{{ path }}</code>
    <button 
      class="copy-btn" 
      @click="copyToClipboard"
      :title="copied ? '已复制!' : '复制路径'"
      :class="{ 'copied': copied }"
    >
      <svg v-if="!copied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  path: string
}

const props = defineProps<Props>()
const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.path)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // 降级方案：使用传统的复制方法
    const textArea = document.createElement('textarea')
    textArea.value = props.path
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<style scoped>
.copy-path-wrapper {
  display: inline-flex;
  align-items: center;
  position: relative;
}

.path-text {
  background: var(--vp-code-bg);
  border: 1px solid var(--vp-c-divider);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  color: var(--vp-c-text-1);
  margin: 0;
}

.copy-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  opacity: 0.7;
  position: relative;
  min-width: 22px;
  min-height: 22px;
}

.copy-btn:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  opacity: 1;
}

.copy-btn:active {
  transform: scale(0.95);
}

.copy-btn.copied {
  color: var(--vp-c-brand-1);
  opacity: 1;
}

.copy-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .path-text {
    font-size: 0.8em;
    padding: 1px 4px;
  }
  
  .copy-btn {
    padding: 3px;
    margin-left: 4px;
    min-width: 20px;
    min-height: 20px;
  }
  
  .copy-btn svg {
    width: 12px;
    height: 12px;
  }
}
</style>