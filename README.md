# Mp2RSS

把微信公众号转成标准 Feed 的订阅服务 —— 在 Reeder、NetNewsWire、FreshRSS、Miniflux 等任意阅读器里，像订阅播客一样订阅公众号。

- 🌐 产品主站：<https://mp2rss.bugcode.dev>
- 📖 使用文档：<https://areyoubugcoder.github.io/Mp2RSS/>

## 特性

- 🪶 **无需微信账号** —— GitHub / Google OAuth 登录即可使用
- 📡 **主流格式全覆盖** —— RSS 2.0 / Atom 1.0 / JSON Feed 1.1 / OPML 2.0
- 🗂️ **单号 + 合集双形态** —— 按公众号订阅，或聚合成一个 Feed
- 🔁 **一处订阅，多端同步** —— 同一条链接粘贴到任意阅读器
- 🎁 **3 天免费试用** —— 试用期权益与正式会员完全相同
- 🤖 **API 友好** —— 搜索、订阅、拉文章均可脚本化

## 快速开始

1. 打开 <https://mp2rss.bugcode.dev>，用 GitHub / Google 登录；
2. 在订阅管理页贴入任意一篇公众号文章 URL 完成订阅；
3. 在账户设置页复制 Feed 链接，粘贴到你的阅读器即可持续收到更新。

详细步骤见 [快速开始](https://areyoubugcoder.github.io/Mp2RSS/guide/quick-start)。

## 文档导航

- [服务介绍](https://areyoubugcoder.github.io/Mp2RSS/guide/intro)
- [订阅管理](https://areyoubugcoder.github.io/Mp2RSS/guide/subscription)
- [会员与计费](https://areyoubugcoder.github.io/Mp2RSS/guide/membership)
- [Open API 列表](https://areyoubugcoder.github.io/Mp2RSS/api/)
- [FAQ](https://areyoubugcoder.github.io/Mp2RSS/guide/faq)
- [服务条款](https://areyoubugcoder.github.io/Mp2RSS/guide/terms-of-service)

## 反馈与交流

- Bug / 功能建议：[Issues](https://github.com/areyoubugcoder/Mp2RSS/issues)
- 使用讨论：[Discussions](https://github.com/areyoubugcoder/Mp2RSS/discussions)

---

## 本仓库说明

本仓库托管 Mp2RSS 的产品介绍与 Open API 文档站点，基于 [VitePress](https://vitepress.dev/) 构建，推送到 `main` 后由 GitHub Actions 自动部署到 GitHub Pages。

### 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # 产物输出到 .vitepress/dist
pnpm preview    # 本地预览生产构建
```

### 目录结构

- `docs/` —— 站点内容源文件
  - `index.md` —— 首页
  - `guide/` —— 使用指南
  - `api/` —— Open API 参考
  - `public/` —— 静态资源（favicon / logo）
- `.vitepress/` —— VitePress 配置与主题定制
  - `config.mts` —— 站点配置
  - `theme/` —— 主题增强（`CopyPath` 组件等）
- `.github/workflows/deploy.yml` —— Pages 部署工作流
