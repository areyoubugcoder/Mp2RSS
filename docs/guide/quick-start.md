# 快速开始

## 1. 登录

打开 Mp2RSS 控制台，使用 **GitHub** 或 **Google** 完成 OAuth 登录。

- 同一邮箱对应同一账户，先后用不同 OAuth 来源登录会合并到同一账户；
- 若 OAuth 回调未返回可用邮箱（GitHub 邮箱设为私有 / Google 邮箱未验证），登录会被拒绝 —— 先在 OAuth 提供方处公开 / 验证邮箱后重试。

登录后系统会生成账户的 **Feed 密钥**；是否赠送免费试用以站内显示为准，未获赠试用时需先在价格页购买套餐档位开通会员。可在「账户设置」查看 Feed 链接与会员有效期。

## 2. 订阅信息源

### 公众号

在「订阅管理」粘贴任意一篇公众号文章 URL（`https://mp.weixin.qq.com/s?...`），系统反查并登记该公众号。

### X 账号

X 订阅以 **`xUserId`**（X 内部 user_id，如 `44196397`）为业务键。在「订阅管理 → X」搜索框输入 displayName 或 username（如 `elon`），从候选列表选要订阅的账号即可。

> X 账号搜索与订阅 / 取消订阅**仅在 Web 控制台提供**，Open API 与 CLI 不暴露这些写类端点；脚本只能用 `mp2rss x posts / x articles` 拉取已订阅账号的内容。

### 配额

订阅上限由所购**套餐档位**决定（当前在售 **50 / 100 / 400 个**三档），公众号与 X 合并计算。详见[会员与计费](/guide/membership)。

## 3. 复制 Feed 链接

在「账户设置」复制 Feed 链接。链接携带密钥，任意阅读器**无需登录**即可访问，默认合并 MP + X 时间线。

## 4. 导入阅读器

- **客户端阅读器**（Reeder / NetNewsWire / Fluent Reader 等）：粘贴 RSS / Atom 链接；
- **自建 RSS 服务**（FreshRSS / Miniflux / Tiny Tiny RSS 等）：粘贴链接，或导入 OPML 一次性迁移；
- **JSON Feed 消费方**：直接使用 JSON Feed 1.1 链接。

## 更多

- [订阅管理](/guide/subscription)
- [会员与计费](/guide/membership)
- [API 列表](/api/)
- [CLI 工具](/cli/)
