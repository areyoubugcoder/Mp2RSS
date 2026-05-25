<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import TypewriterRotator from './TypewriterRotator.vue';

const { Layout } = DefaultTheme;

const phrases = [
  '公众号文章，变成你阅读器里的 RSS',
  'X 推文与长文，进入你信任的阅读器',
  '一处订阅，多端同步——公众号 + X 共用同一条 Feed',
  '无需微信账号，OAuth 登录即可',
  '脚本化订阅，Open API + CLI 双通道',
  '把信任的信息源，从碎片化平台搬回阅读器',
  '更多信息源，正在路上',
];
</script>

<template>
  <Layout>
    <template #home-hero-actions-after>
      <div class="typewriter-hero">
        <TypewriterRotator :phrases="phrases" />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.typewriter-hero {
  margin-top: 1.5rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  min-height: 2em;
  text-align: center;
}

@media (min-width: 960px) {
  .typewriter-hero {
    font-size: 1.2rem;
    text-align: left;
  }
}
</style>
