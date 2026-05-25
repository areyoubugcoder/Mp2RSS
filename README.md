<p align="center">
  <img src="./docs/public/logo.png" alt="Mp2RSS" width="128" />
</p>

<h1 align="center">Mp2RSS</h1>

<p align="center">把信任的信息源，搬进你熟悉的阅读器 —— 微信公众号、X（Twitter）账号持续转成标准 Feed，在 Reeder、NetNewsWire、FreshRSS、Miniflux 等阅读器即粘即用。</p>

- 🌐 产品主站：<https://mp2rss.bugcode.dev>
- 📖 使用文档：<https://areyoubugcoder.github.io/Mp2RSS/>

## 特性

- 📰 **公众号订阅** —— 贴入任意一篇文章 URL 即可订阅整号，系统持续抓取最新文章
- 🐦 **X 账号订阅** —— 订阅 X（Twitter）账号，推文与长文以结构化数据 + 渲染 Feed 双形态对外暴露
- 📡 **主流格式全覆盖** —— RSS 2.0 / Atom 1.0 / JSON Feed 1.1 / OPML 2.0
- 🔁 **一处订阅，多端同步** —— 公众号 + X 共用同一条 Feed 链接，多端粘贴即用
- 🪶 **无需微信账号** —— GitHub / Google OAuth 登录即可使用
- 🎁 **3 天免费试用** —— 试用期权益与正式会员完全相同
- 🤖 **全平台 Open API** —— 订阅管理、内容拉取均可脚本化，便于接入自动化流水线
- 💻 **配套 CLI（`mp2rss`）** —— 把订阅管理塞进终端与脚本
- 🧠 **为 AI Agent 优化** —— 提供 Skill 接入，Agent 可直接代你订阅、检索、拉取最新文章

## 快速开始

1. 打开 <https://mp2rss.bugcode.dev>，用 GitHub / Google 登录；
2. 在「订阅管理」订阅信息源：
   - **公众号** —— 粘贴任意一篇文章 URL（`https://mp.weixin.qq.com/s?...`）；
   - **X 账号** —— 在搜索框输入 displayName 或 username 选择即可；
3. 在「账户设置」复制 Feed 链接，粘贴到阅读器即可持续收到更新（默认合并 MP + X 时间线）。

订阅上限 400 个，公众号与 X 合并计算。详细步骤见 [快速开始](https://areyoubugcoder.github.io/Mp2RSS/guide/quick-start)。

更进阶的玩法：

- 🛠️ [Open API](https://areyoubugcoder.github.io/Mp2RSS/api/) —— 把订阅、检索、文章 / 推文 / 长文拉取接进自己的服务或 AI Agent
- ⌨️ [CLI 文档](https://areyoubugcoder.github.io/Mp2RSS/cli/) —— 终端里一行命令完成登录、订阅与管理
- 🤖 [AI Agent 接入指南](https://github.com/areyoubugcoder/mp2rss-cli#ai-agent-%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8) —— 把 mp2rss 装进 Claude Code / Cursor 等 Agent，让它代你订阅与检索
- 🐾 [openclaw 集成](https://github.com/areyoubugcoder/mp2rss-openclaw) —— 在 openclaw 里直接调用 mp2rss 能力

## 文档导航

- [服务介绍](https://areyoubugcoder.github.io/Mp2RSS/guide/intro)
- [订阅管理](https://areyoubugcoder.github.io/Mp2RSS/guide/subscription)
- [会员与计费](https://areyoubugcoder.github.io/Mp2RSS/guide/membership)
- [Open API](https://areyoubugcoder.github.io/Mp2RSS/api/)
- [CLI 文档](https://areyoubugcoder.github.io/Mp2RSS/cli/)
- [AI Agent 接入指南](https://github.com/areyoubugcoder/mp2rss-cli#ai-agent-%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8)
- [openclaw 集成](https://github.com/areyoubugcoder/mp2rss-openclaw)
- [FAQ](https://areyoubugcoder.github.io/Mp2RSS/guide/faq)
- [服务条款](https://areyoubugcoder.github.io/Mp2RSS/guide/terms-of-service)

## 反馈与交流

- Bug / 功能建议：[Issues](https://github.com/areyoubugcoder/Mp2RSS/issues)
- 使用讨论：[Discussions](https://github.com/areyoubugcoder/Mp2RSS/discussions)
