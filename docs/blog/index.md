---
title: Blog —— 公众号数据应用场景专栏
description: Mp2RSS 场景专栏：按行业与场景拆解微信公众号文章数据的获取与应用 —— 舆情监测、投研情报、内容监测、AI 工作流 / RAG、个人信息管理等实践指南，持续更新。
---

# Blog · 公众号数据应用场景专栏

微信公众号沉淀了大量高质量的一手内容，但它没有公开的订阅接口，数据获取一直是各行业的共同难题。本专栏按**行业 × 场景**持续拆解：不同角色的人如何把公众号文章变成可订阅、可检索、可编程的数据，接入自己的工作流。

每篇文章聚焦一个具体场景，从真实痛点出发，给出可落地的操作步骤。

<script setup>
import { data as posts } from './posts.data.ts'
</script>

<ul class="blog-post-list">
  <li v-for="post of posts" :key="post.url" class="blog-post-item">
    <div class="blog-post-date">{{ post.date }}</div>
    <div>
      <a :href="post.url" class="blog-post-title">{{ post.title }}</a>
      <p class="blog-post-desc">{{ post.description }}</p>
    </div>
  </li>
</ul>

<style scoped>
.blog-post-list {
  list-style: none;
  padding: 0;
  margin-top: 24px;
}
.blog-post-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  margin: 0;
}
.blog-post-date {
  flex: none;
  width: 96px;
  color: var(--vp-c-text-3);
  font-size: 14px;
  line-height: 28px;
  font-variant-numeric: tabular-nums;
}
.blog-post-title {
  font-size: 17px;
  font-weight: 600;
  line-height: 28px;
}
.blog-post-desc {
  margin: 4px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}
</style>
