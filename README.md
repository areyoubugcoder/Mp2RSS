<p align="center">
  <img src="./docs/public/logo.png" alt="Mp2RSS —— 微信公众号文章数据服务" width="128" />
</p>

<h1 align="center">Mp2RSS</h1>

<p align="center"><b>微信公众号文章数据服务</b><br />持续抓取公众号最新文章，沉淀为含 Markdown 正文的结构化数据，通过 RSS / JSON Feed / Open API / CLI / AI Agent 多种形态交付 —— 支撑舆情分析、投研报告、内容监测、高质量信息收集与个人内容阅读。</p>

<p align="center"><i>Mp2RSS is a WeChat Official Account (公众号) article data service — continuously collected, structured article data delivered as RSS / JSON Feed, a JSON Open API, a CLI, and AI-agent integrations.</i></p>

- 🌐 产品主站：<https://mp2rss.bugcode.dev>
- 📖 使用文档：<https://areyoubugcoder.github.io/Mp2RSS/>
- 🤖 机器可读摘要（llms.txt）：<https://areyoubugcoder.github.io/Mp2RSS/llms.txt>
- ✍️ Blog 场景专栏：<https://areyoubugcoder.github.io/Mp2RSS/blog/>

## Mp2RSS 是什么

Mp2RSS 是一个**公众号文章数据服务**：贴入任意一篇公众号文章的链接，即可订阅它所属的整个公众号；系统随后持续抓取该号发布的每一篇新文章，沉淀为**带 Markdown 正文的结构化文章数据**，再按你的消费习惯交付 —— 可以是阅读器里的一条 RSS，也可以是数据管道里的一个 JSON 接口，或是 AI Agent 手边的一个实时数据源。全程**无需微信账号、无需扫码**，GitHub / Google 登录即可使用。

- ⏱️ **更新时效**：从公众号发文到数据可见平均 **2–3 小时**；
- 📝 **结构化正文**：每篇文章附带 Markdown 正文，人能读，程序和 AI 也能直接消费；
- 🔗 **单号 + 合集**：每个公众号独立成流，也可合并为一条聚合时间线。

## 应用方向

| 方向 | 用法 |
| ---- | ---- |
| 📊 **舆情分析** | 批量订阅目标公众号，用 Open API 持续拉取新文章正文，接入分词、情感分析与告警系统，掌握舆论动态 |
| 📈 **投研报告** | 跟踪券商研报号、行业媒体号、上市公司官方号的发文，结构化正文直接进入研报素材库与量化数据管道 |
| 🔍 **内容监测** | 监测竞品号、行业号的发文节奏与选题动向，接入看板与通知，第一时间获知变化 |
| 📚 **高质量信息收集** | 把可信赖的信源沉淀为自己的内容库：Markdown 正文便于归档、全文检索与二次加工 |
| 📰 **个人内容阅读** | 订阅链接粘贴进 Reeder、NetNewsWire、FreshRSS、Miniflux 等阅读器，摆脱算法时间线，按自己的节奏读 |
| 🧠 **AI 工作流 / RAG** | Agent 通过 Skill 或 API 实时获取公众号最新文章，作为检索增强与问答的数据支持 |

## 数据交付形态

同一份公众号文章数据，四种方式取用：

| 形态 | 适合谁 | 说明 |
| ---- | ------ | ---- |
| 📡 **标准 Feed** | 阅读器用户 | RSS 2.0 / Atom 1.0 / JSON Feed 1.1 / OPML 2.0 全格式输出，主流阅读器即粘即用 |
| 🛠️ **Open API（JSON）** | 开发者 / 数据团队 | 订阅管理、文章拉取（含 Markdown 正文）全部可脚本化，直接接入舆情、投研、监测等数据流水线 |
| 💻 **CLI（`mp2rss`）** | 终端与脚本 | 一行命令完成登录、订阅公众号、拉取文章，可挂进定时任务 |
| 🧠 **AI Agent 联动** | Claude Code / Cursor 等 | 提供 Skill 接入，Agent 可直接代你订阅公众号、检索与拉取最新文章 |

## 核心特性

- 📰 **文章链接反查订阅** —— 贴入任意一篇文章 URL（`https://mp.weixin.qq.com/s?...`）即可订阅整号，无需知道公众号 ID
- 🔄 **持续自动抓取** —— 订阅后系统主动收录新文章，阅读器与程序按自己的节奏拉取
- 🪶 **无需微信账号** —— GitHub / Google OAuth 登录即可使用，不挂微信、不刷手机
- 🔑 **可复位的 Feed 密钥** —— Feed 链接与 API Bearer Token 共用同一密钥，泄漏时一键重置、旧链接即时失效
- 🎁 **多档订阅任选** —— 50 / 100 / 400 订阅上限三档按需选择，功能权益全档一致
- 🐦 **扩展信息源：X（Twitter）** —— 亦可订阅 X 账号，推文与长文以结构化数据 + 渲染 Feed 双形态输出，与公众号共用同一条聚合时间线

## 快速开始

1. 打开 <https://mp2rss.bugcode.dev>，用 GitHub / Google 登录；
2. 在「订阅管理」贴入任意一篇公众号文章的 URL，完成订阅；
3. 按需取数：复制 Feed 链接粘贴到阅读器；或以 Feed 密钥作为 Bearer Token 调用 [Open API](https://areyoubugcoder.github.io/Mp2RSS/api/) 拉取 JSON 数据。

订阅上限由所购套餐档位决定（当前在售 50 / 100 / 400 个三档，公众号与 X 合并计算）。详细步骤见 [快速开始](https://areyoubugcoder.github.io/Mp2RSS/guide/quick-start)。

更进阶的玩法：

- 🛠️ [Open API](https://areyoubugcoder.github.io/Mp2RSS/api/) —— 把公众号订阅管理与文章拉取接进自己的服务或数据管道
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
