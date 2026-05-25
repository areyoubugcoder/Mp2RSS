# 命令行工具 (mp2rss CLI)

`mp2rss` 是 Mp2RSS 官方命令行工具，让你在终端里完成订阅、查询、管理
**公众号、X（Twitter）等多种信息源**的全部操作，无需打开浏览器控制台。

## 它能做什么

- 通过浏览器登录或直接传入 Feed 密钥完成鉴权。
- 列出、搜索、订阅、取消订阅 **公众号 (`mp ...`)**，列出 **已订阅 X 账号 (`x list`)**。
- 拉取 **公众号文章** 与 **X 推文 / X 长文** 列表。
- 同时支持 **表格** 与 **JSON** 两种输出模式，便于人眼阅读或脚本处理。

> X 账号搜索与订阅 / 取消订阅**仅在 Web 控制台提供**，CLI 与 Open API 都不暴露这些写类操作；脚本场景请走「Web 控制台完成订阅 → CLI 拉内容」的分工。

## 快速上手

```bash
# 1. 登录（浏览器会自动打开 Mp2RSS 的授权页）
mp2rss auth login

# 2. 订阅一个公众号（粘贴任意一篇该号的文章链接）
mp2rss mp subscribe https://mp.weixin.qq.com/s/xxxxxxxxxx

# 3. 查看当前账户下的全部订阅
mp2rss mp list
mp2rss x list                                  # X 订阅请先在 Web 控制台完成
```

## 安装

推荐一键脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/areyoubugcoder/mp2rss-cli/main/scripts/install.sh | sh
```

其他安装方式（npm / 直接下载 / 源码构建）见 [安装](./install)。

## 使用场景演示

CLI 是纯文本接口、输出稳定，可直接被 AI Agent 封装为技能调用。下面是在 **Pi Coding Agent** 中通过自然语言驱动 `mp2rss` 的真实片段：

### 一句话订阅公众号

把任意一篇公众号文章链接丢给 Agent，它会自动调用 `mp2rss mp subscribe` 完成订阅：

![在 Pi Coding Agent 中一句话订阅公众号](/agent-subscribe.png)

### 自然语言查看订阅列表

直接问「我订阅了哪些公众号」，Agent 会调用 `mp2rss mp list` 并把表格结果整理成易读格式：

![在 Pi Coding Agent 中查看订阅列表](/agent-list.png)

### 一句话拉取已订阅 X 账号的推文

X 订阅在 Web 控制台完成后，把「看一下 Elon Musk 最近发了啥」丢给 Agent，它会先 `mp2rss x list -o json` 找到对应 `xUserId`，再 `mp2rss x posts <xUserId>` 拉推文流：

```bash
$ mp2rss x list -o json | jq -r '.items[] | "\(.xUserId)\t@\(.xUsername)"'
44196397	@elonmusk

$ mp2rss x posts 44196397 -o json | jq -r '.items[0:3][].content'
```

## 下一步

- [安装](./install)：本地构建步骤、平台兼容性。
- [登录](./login)：三条登录路径（默认浏览器、Feed 密钥、无浏览器）。
- [命令参考](./commands)：完整命令、参数、退出码、示例（含 `mp` 与 `x` 两个命令组）。
- [FAQ](./faq)：常见问题与排查（含 X 相关）。
