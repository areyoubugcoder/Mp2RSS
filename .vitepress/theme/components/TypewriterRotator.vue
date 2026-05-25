<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

// 与 mp2rss/apps/web/src/routes/index.tsx 的 TypewriterRotator 行为对齐
const TYPING_MS = 50;
const DELETING_MS = 25;
const PAUSE_AFTER_TYPED_MS = 2200;
const PAUSE_AFTER_DELETED_MS = 300;

const props = withDefaults(
  defineProps<{
    phrases: string[];
  }>(),
  {
    phrases: () => [],
  },
);

const reduced = ref(false);
const phraseIndex = ref(0);
const charIndex = ref(0);
const phase = ref<'typing' | 'deleting'>('typing');

let timer: ReturnType<typeof setTimeout> | null = null;
let mq: MediaQueryList | null = null;
const handleMq = (e: MediaQueryListEvent) => {
  reduced.value = e.matches;
};

function clear() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

function schedule() {
  clear();
  if (reduced.value) return;
  const current = props.phrases[phraseIndex.value] ?? '';
  const fullyTyped = charIndex.value >= current.length;
  const fullyDeleted = charIndex.value <= 0;
  const delay =
    phase.value === 'typing'
      ? fullyTyped
        ? PAUSE_AFTER_TYPED_MS
        : TYPING_MS
      : fullyDeleted
        ? PAUSE_AFTER_DELETED_MS
        : DELETING_MS;
  timer = setTimeout(() => {
    if (phase.value === 'typing') {
      if (fullyTyped) {
        phase.value = 'deleting';
      } else {
        charIndex.value = charIndex.value + 1;
      }
    } else {
      if (fullyDeleted) {
        phraseIndex.value = (phraseIndex.value + 1) % Math.max(1, props.phrases.length);
        phase.value = 'typing';
      } else {
        charIndex.value = charIndex.value - 1;
      }
    }
    schedule();
  }, delay);
}

onMounted(() => {
  if (typeof window === 'undefined') return;
  mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduced.value = mq.matches;
  // 浏览器兼容：优先 addEventListener，老版本回退 addListener
  if (mq.addEventListener) {
    mq.addEventListener('change', handleMq);
  } else if ((mq as any).addListener) {
    (mq as any).addListener(handleMq);
  }
  schedule();
});

onBeforeUnmount(() => {
  clear();
  if (mq) {
    if (mq.removeEventListener) {
      mq.removeEventListener('change', handleMq);
    } else if ((mq as any).removeListener) {
      (mq as any).removeListener(handleMq);
    }
  }
});

// 减少动效偏好切换时重新调度
watch(reduced, () => {
  if (reduced.value) {
    clear();
  } else {
    schedule();
  }
});

const visibleText = computed(() => {
  const current = props.phrases[phraseIndex.value] ?? '';
  if (reduced.value) return props.phrases[0] ?? '';
  return current.slice(0, charIndex.value);
});
</script>

<template>
  <span class="typewriter-rotator" aria-live="polite">
    <span aria-hidden="true">{{ visibleText }}<span v-if="!reduced" class="typewriter-cursor" /></span>
    <span class="sr-only">{{ phrases[0] }}</span>
  </span>
</template>

<style scoped>
.typewriter-rotator {
  display: inline-flex;
  align-items: baseline;
  min-height: 1.4em;
  font-weight: 600;
  color: var(--vp-c-brand-1, currentColor);
}

/* 与 mp2rss/apps/web/src/styles.css 的 @keyframes typewriter-blink 一致 */
@keyframes typewriter-blink {
  0%,
  50% {
    opacity: 1;
  }
  50.01%,
  100% {
    opacity: 0;
  }
}

.typewriter-cursor {
  display: inline-block;
  width: 0.14rem;
  height: 0.9em;
  margin-left: 0.18rem;
  background-color: currentColor;
  vertical-align: -0.06em;
  animation: typewriter-blink 1s step-end infinite;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .typewriter-cursor {
    animation: none;
  }
}
</style>
