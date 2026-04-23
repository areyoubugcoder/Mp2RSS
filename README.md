# Mp2RSS Docs

Mp2RSS 产品介绍与 Open API 文档站点，基于 [VitePress](https://vitepress.dev/) 构建。

## 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # 产物输出到 .vitepress/dist
pnpm preview    # 本地预览生产构建
```

## 目录

- `docs/` —— 站点内容源文件
  - `index.md` —— 首页
  - `guide/` —— 使用指南
  - `api/` —— Open API 参考
  - `public/` —— 静态资源（favicon / logo）
- `.vitepress/` —— VitePress 配置与主题定制
  - `config.mts` —— 站点配置（nav / sidebar / search）
  - `theme/` —— 主题增强（`CopyPath` 组件、自定义样式）
