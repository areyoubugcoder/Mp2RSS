---
layout: home

hero:
  name: "Mp2RSS"
  text: "把信任的信息源，搬进你熟悉的阅读器"
  tagline: 公众号、X，以及更多 —— 一处订阅，多端同步，主流 Feed 格式即取即用
  image:
    src: /logo.png
    alt: Mp2RSS
  actions:
    - theme: brand
      text: 立即使用
      link: https://mp2rss.bugcode.dev
      target: _blank
      rel: noopener
    - theme: alt
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 服务介绍
      link: /guide/intro
    - theme: alt
      text: API
      link: /api/
    - theme: alt
      text: CLI
      link: /cli/

features:
  - icon: 📰
    title: 公众号订阅
    details: 贴入任意一篇公众号文章 URL 即可订阅整号；自动持续抓取最新文章，无需登录微信、无需手动搬运。
  - icon: 🐦
    title: X 账号订阅
    details: 用 xUserId 一键订阅 X（Twitter）账号，推文与长文以结构化数据 + 渲染 Feed 双形态对外暴露。
  - icon: 🔍
    title: X 账号搜索
    details: 按昵称模糊搜索任意 X 账号，异步任务 + 增量轮询拿结果，把不熟悉的账号找出来再决定订阅。
  - icon: 📡
    title: 主流格式全覆盖
    details: 同时输出 RSS 2.0 / Atom 1.0 / JSON Feed 1.1 / OPML 2.0，任何阅读器按需选择。
  - icon: 🔁
    title: 一处订阅，多端同步
    details: 公众号 + X 共用同一条 Feed 链接，在 Reeder、NetNewsWire、FreshRSS、Miniflux 等阅读器即粘即用。
  - icon: 🪶
    title: 无需微信账号
    details: 使用 GitHub / Google OAuth 即可注册；隐私与便捷兼得，不挂微信、不刷手机。
  - icon: 🎁
    title: 多档订阅任选
    details: 50 / 100 / 400 订阅上限三档按需选择，功能权益全档一致；升档立即生效，续费时长自动叠加。
  - icon: 🤖
    title: 全平台 Open API
    details: MP / X 两类信息源的订阅、搜索、文章 / 推文 / 长文拉取，均通过统一 Open API 暴露，便于脚本化接入。
---
