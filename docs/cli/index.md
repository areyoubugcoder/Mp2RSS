# 命令行工具 (mp2rss CLI)

`mp2rss` 是 Mp2RSS 官方命令行工具，让你在终端里完成订阅、查询、管理公众号的全部操作，无需打开浏览器控制台。

## 面向场景

- **本地脚本化**：把订阅与文章查询接入自己的自动化脚本、cron、CI 流水线。
- **多端管理**：在服务器、远程开发机、容器内无 GUI 环境下管理订阅。
- **批量与回归**：通过 JSON 输出搭配 `jq` 做批量过滤、对账与回归。
- **零依赖单文件**：CLI 是一个独立的二进制，没有运行时依赖。

## 它能做什么

- 通过浏览器登录或直接传入 Feed 密钥完成鉴权。
- 列出、搜索、订阅、取消订阅公众号。
- 查询单个公众号下的历史文章。
- 同时支持 **表格** 与 **JSON** 两种输出模式，便于人眼阅读或脚本处理。

## 快速上手

```bash
# 1. 登录（浏览器会自动打开 Mp2RSS 的授权页）
mp2rss auth login

# 2. 订阅一个公众号（粘贴任意一篇该号的文章链接）
mp2rss mp subscribe https://mp.weixin.qq.com/s/xxxxxxxxxx

# 3. 查看当前账户下的订阅
mp2rss mp list
```

## 使用场景演示

CLI 是纯文本接口、输出稳定，可直接被 AI Agent 封装为技能调用。下面是在 **Pi Coding Agent** 中通过自然语言驱动 `mp2rss` 的两个真实片段：

### 一句话订阅公众号

把任意一篇公众号文章链接丢给 Agent，它会自动调用 `mp2rss mp subscribe` 完成订阅：

![在 Pi Coding Agent 中一句话订阅公众号](/订阅公众号.png)

### 自然语言查看订阅列表

直接问「我订阅了哪些公众号」，Agent 会调用 `mp2rss mp list` 并把表格结果整理成易读格式：

![在 Pi Coding Agent 中查看订阅列表](/订阅列表.png)

## 安装速览

四种方式，按场景任选其一：

```bash
# 一键安装（推荐 macOS / Linux）
curl -fsSL https://raw.githubusercontent.com/areyoubugcoder/mp2rss-cli/main/scripts/install.sh | sh

# npm 包装（Node ≥ 18）
pnpm add -g @mp2rss/cli

# 直接下载
# https://github.com/areyoubugcoder/mp2rss-cli/releases/latest

# 源码构建（Go ≥ 1.21）
git clone https://github.com/areyoubugcoder/mp2rss-cli.git && cd mp2rss-cli && make build
```

详细步骤、环境变量覆盖与卸载指引见 [安装](./install)。

## 下一步

- [安装](./install)：本地构建步骤、平台兼容性。
- [登录](./login)：三条登录路径（默认浏览器、Feed 密钥、无浏览器）。
- [命令参考](./commands)：完整命令、参数、退出码、示例。
- [FAQ](./faq)：常见问题与排查。
