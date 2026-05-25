# 服务介绍

Mp2RSS 把 **微信公众号** 与 **X（Twitter）账号** 持续转成标准 Feed（RSS / Atom / JSON Feed / OPML），可在 Reeder、NetNewsWire、FreshRSS、Miniflux 等阅读器订阅。

## 支持的信息源

| 信息源 | 业务键 | 订阅方式 | 输出形态 |
| ------ | ------ | -------- | -------- |
| 微信公众号（MP） | `mpId`（整数） | 贴入任意一篇公众号文章 URL 反查 | 文章列表（含 markdown 正文） |
| X / Twitter | `xUserId`（字符串） | 已知 `xUserId` 直接订阅；或按昵称搜索后订阅 | 推文流 + 长文流 |

订阅配额在不同信息源之间**合并计算**。

## 核心流程

1. 用 GitHub / Google 账号登录；
2. 订阅信息源 —— 公众号贴文章链接、X 账号传 `xUserId`（或先搜索后订阅）；
3. 复制 Feed 链接（单源或合集）贴入阅读器。

## 服务特点

- **统一聚合**：公众号 + X 共用同一条 Feed 链接，时间线合并；
- **无需微信账号**：不必登录微信或扫码授权；
- **主动收录**：订阅后系统持续抓取新内容，阅读器按自己节奏拉取；
- **多格式并存**：RSS 2.0 / Atom 1.0 / JSON Feed 1.1 / OPML 2.0；
- **单号 + 合集**：每个信息源有独立 Feed，也可合并为一个聚合 Feed；
- **可复位的 Feed 密钥**：随时一键重置，旧链接立即失效；
- **API / CLI 友好**：订阅管理、X 搜索、内容拉取均可通过 Open API 或 `mp2rss` CLI 接入。

## 下一步

- [快速开始](/guide/quick-start)
- [API 列表](/api/)
- [CLI 工具](/cli/)
- [会员与计费](/guide/membership)
