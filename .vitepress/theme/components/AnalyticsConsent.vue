<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

type Choice = "granted" | "denied" | null;
type ConsentWindow = Window & {
  mp2rssConsent?: {
    getChoice(): Choice;
    setChoice(value: Exclude<Choice, null>): void;
  };
};
const ready = ref(false);
const choice = ref<Choice>(null);
const popup = ref<HTMLDialogElement>();
function refresh() {
  ready.value = !!(window as ConsentWindow).mp2rssConsent;
  choice.value = (window as ConsentWindow).mp2rssConsent?.getChoice() ?? null;
}
function choose(value: Exclude<Choice, null>) {
  (window as ConsentWindow).mp2rssConsent?.setChoice(value);
}
function preventDismiss(event: Event) {
  event.preventDefault();
}
watch([ready, choice], async () => {
  await nextTick();
  if (!popup.value) return;
  if (ready.value && !choice.value) {
    if (!popup.value.open) popup.value.showModal();
  } else popup.value.close();
});
onMounted(() => {
  refresh();
  window.addEventListener("mp2rss:consent", refresh);
});
onUnmounted(() => window.removeEventListener("mp2rss:consent", refresh));
</script>

<template>
  <template v-if="ready">
    <dialog
      ref="popup"
      class="analytics-dialog"
      closedby="none"
      aria-labelledby="analytics-title"
      aria-describedby="analytics-description"
      @cancel="preventDismiss"
      @keydown.esc.prevent.stop="preventDismiss"
    >
      <div class="drawer-content">
        <div class="copy">
          <p class="eyebrow">Mp2RSS · Cookies</p>
          <h2 id="analytics-title" tabindex="-1" autofocus>
            帮助我们把 Mp2RSS 做得更好
          </h2>
          <p id="analytics-description" class="description">
            我们使用 Google Analytics 统计
            Cookie，了解网站使用情况及注册、内容交付和购买效果，用于改进服务，不用于广告。
          </p>
          <p class="hint">请先选择是否启用统计，然后继续使用网站。</p>
        </div>
        <div class="actions">
          <button class="accept" @click="choose('granted')">同意并继续</button>
          <button class="decline" @click="choose('denied')">暂不启用</button>
        </div>
      </div>
    </dialog>
  </template>
</template>

<style scoped>
:global(body:has(.analytics-dialog[open])) { overflow: hidden; }
.analytics-dialog {
  box-sizing: border-box;
  position: fixed;
  inset: auto 0 0;
  margin: 0;
  width: 100%;
  max-width: none;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 32px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px 16px 0 0;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-size: 14px;
  box-shadow: 0 1px 3px #0001;
}
.analytics-dialog[open] {
  animation: analytics-consent-enter 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.analytics-dialog::backdrop {
  background: #000b;
}
.drawer-content {
  max-width: 1024px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 40px;
}
.copy {
  flex: 1;
  min-width: 0;
}
.eyebrow {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.025em;
}
h2 {
  font-size: 21px;
  line-height: 1.4;
  font-weight: 600;
  outline: none;
}
.description {
  margin: 12px 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 208px;
  flex-shrink: 0;
}
.actions button {
  padding: 10px 16px;
  border-radius: 6px;
  line-height: 1.5;
  font-weight: 500;
}
.accept {
  background: #fdc800;
  color: #1c293c;
  border: 1px solid transparent;
}
.accept:hover {
  background: #eab900;
}
.decline:hover {
  background: var(--vp-c-bg-soft);
}
.hint {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.6;
}
button {
  cursor: pointer;
}
button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
@keyframes analytics-consent-enter {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@media (max-width: 767px) {
  .analytics-dialog {
    padding: 24px;
  }
  .drawer-content {
    flex-direction: column;
    gap: 24px;
  }
  .actions {
    width: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .analytics-dialog[open] {
    animation: none;
  }
}
</style>
