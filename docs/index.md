---
layout: home

hero:
  name: "Mp2RSS"
  text: "公众号与 X 内容订阅服务"
  tagline: 持续获取公众号文章、X 推文与长文，通过 RSS、Open API、CLI 和 Agent 接入个人阅读、研究与 AI 工作流
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
      text: Agent 首次获取内容
      link: /cli/first-delivery

features:
  - icon: 📰
    title: 公众号文章抓取
    details: 用公众号文章 URL 建立订阅，持续获取新增文章；发文与数据可见存在采集延迟，使用正文前需检查内容是否完整。
  - icon: 📡
    title: 主流 Feed 格式全覆盖
    details: 同时输出 RSS 2.0 / Atom 1.0 / JSON Feed 1.1 / OPML 2.0，在 Reeder、NetNewsWire、FreshRSS、Miniflux 等阅读器即粘即用。
  - icon: 🛠️
    title: 全平台 Open API
    details: 通过 JSON 接口管理公众号订阅，读取已订阅源的文章、推文与长文；X 的搜索及订阅管理在 Web 控制台完成。
  - icon: 🧠
    title: 为 AI Agent 优化
    details: 提供 Skill 接入与 llms.txt 机器摘要，Claude Code / Cursor 等 Agent 可直接代你订阅公众号、检索、拉取最新文章。
  - icon: 💻
    title: 配套 CLI（mp2rss）
    details: 终端里一行命令完成登录、订阅公众号、拉取文章，把订阅管理塞进脚本与定时任务。
  - icon: 🪶
    title: 无需微信账号
    details: 使用 GitHub / Google OAuth 即可注册；隐私与便捷兼得，不挂微信、不刷手机。
  - icon: 🎁
    title: 多档订阅任选
    details: 50 / 100 / 400 订阅上限三档按需选择，公众号与 X 合并计算；试用资格、开通时间及续费规则见会员与计费。
  - icon: 🐦
    title: 扩展信息源：X（Twitter）
    details: 亦可订阅 X 账号，按昵称搜索后一键订阅；推文与长文以结构化数据 + 渲染 Feed 双形态输出，与公众号共用同一条聚合时间线。
---
