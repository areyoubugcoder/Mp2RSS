<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

type Choice = 'granted' | 'denied' | null;
type ConsentWindow = Window & { mp2rssConsent?: { getChoice(): Choice; setChoice(value: Exclude<Choice, null>): void } };
const ready = ref(false);
const choice = ref<Choice>(null);
const editing = ref(false);
function refresh() {
  ready.value = !!(window as ConsentWindow).mp2rssConsent;
  choice.value = (window as ConsentWindow).mp2rssConsent?.getChoice() ?? null;
}
function choose(value: Exclude<Choice, null>) {
  (window as ConsentWindow).mp2rssConsent?.setChoice(value);
  editing.value = false;
}
onMounted(() => { refresh(); window.addEventListener('mp2rss:consent', refresh); });
onUnmounted(() => window.removeEventListener('mp2rss:consent', refresh));
</script>

<template>
  <div v-if="ready" class="analytics-preference">
    <button v-if="choice && !editing" class="settings" @click="editing = true">统计设置</button>
    <section v-else aria-label="网站统计偏好" class="panel">
      <h2>网站统计偏好</h2>
      <p>允许后，Google Analytics 会使用统计 Cookie，并关联注册、首次内容交付和购买事件，帮助我们改进服务。不用于广告。拒绝不影响正常使用，你可以随时修改选择。</p>
      <div class="actions">
        <button @click="choose('denied')">拒绝统计</button>
        <button @click="choose('granted')">允许统计</button>
        <button v-if="choice" @click="editing = false">关闭</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.analytics-preference { position: fixed; bottom: 12px; left: 12px; right: 12px; z-index: 50; max-width: 512px; color: var(--vp-c-text-1); font-size: 14px; }
.panel, button { background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.panel { padding: 16px; box-shadow: 0 1px 3px #0001; }
h2 { font-size: 16px; font-weight: 600; }
p { margin: 8px 0 12px; color: var(--vp-c-text-2); line-height: 1.6; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
button { cursor: pointer; padding: 8px 12px; }
button:hover { background: var(--vp-c-bg-soft); }
button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.settings { font-size: 12px; }
</style>
