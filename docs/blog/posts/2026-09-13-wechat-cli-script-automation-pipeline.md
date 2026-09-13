---
title: 开发者如何用 CLI 工具把公众号内容接入自建系统：脚本化管道搭建法
description: 公众号没有官方 API，想把新文章接入自己写的脚本、cron 定时任务或内部系统，又不想为此额外引入一层无代码自动化平台，也不想为简单的提醒需求搭一整套向量库。本文给出用命令行工具直接拉取公众号更新、写进自建存储的落地步骤，平均 2–3 小时数据可见，退出码可直接判断结果并接入 shell 脚本。
date: 2026-09-13
tags: [CLI自动化, 开发者, 数据管道]
---

# 开发者如何用 CLI 工具把公众号内容接入自建系统：脚本化管道搭建法

写内部工具的开发者经常遇到这样的需求：某个公众号——可能是上游供应商的公告号、行业协会的通知号，或者团队自己在关注的信息源——一旦发新文章，希望能自动进入自己维护的系统，比如写进一张数据库表、追加到一个 Git 仓库里的 Markdown 归档、或者触发一条自定义格式的消息推送。这类需求的共同点是：逻辑不复杂，就是"定时检查有没有新文章，有就处理"，但公众号本身不提供任何 API，也没有 Webhook，靠人工盯着看显然不现实。

很多人第一反应是上 n8n、Zapier 这类无代码自动化平台，但对已经有自己一套脚本体系、习惯用 cron、systemd timer 或者 CI 定时任务跑活的开发者来说，再接入一个可视化编排平台反而是额外负担——要维护一个新账号、学一套新的节点体系、还要处理平台自身的调用配额，而实际需要的可能只是一行能塞进 shell 脚本的命令，或者一次能塞进 Python requests 的 HTTP 调用。另一种常见误区是直接照搬 RAG / 向量库那一套重型方案，但如果只是想把新文章标题和链接写进一张表格或者转发到一个 webhook，为此搭一整套 embedding 流水线明显是杀鸡用牛刀。

真正缺的是一个足够"薄"的接口层：命令一执行就能拿到结构化数据，退出码能直接在脚本里判断成功还是失败，输出格式能直接喂给 `jq` 或者一次 HTTP 请求解析，不需要额外经过一层平台。

## 解决思路：把公众号更新变成一次命令行调用

[Mp2RSS](https://mp2rss.bugcode.dev) 把公众号内容转换为可编程访问的数据源，除了 RSS / Atom / JSON Feed 之外，同时提供一个专门给脚本场景用的 **Open API**（`Authorization: Bearer <Feed 密钥>` 鉴权）和一个官方 **CLI 工具 `mp2rss`**，两者背后是同一套数据：贴入任意一篇公众号文章链接即可订阅整号，从发文到数据可见平均 **2–3 小时**，无需微信账号，用 GitHub / Google 登录即可开始。CLI 支持 `-o json` 输出模式，结果可以直接接 `jq` 处理，错误信息同样以 JSON 写进 stdout，退出码按错误类型细分（认证失败、参数错误、资源不存在等），天然适合写进 shell 脚本做条件判断。

## 落地步骤

### 第一步：安装 CLI 并完成鉴权

先按[快速开始](/guide/quick-start)注册账户，登录使用 GitHub / Google 账号即可，不需要绑定微信。安装 CLI：

```bash
curl -fsSL https://raw.githubusercontent.com/areyoubugcoder/mp2rss-cli/main/scripts/install.sh | sh
```

本地交互环境直接 `mp2rss auth login` 走浏览器授权；如果是部署在服务器或 CI 里的无浏览器场景，可以用 `mp2rss auth login --no-browser` 手动粘贴 Feed 密钥，或者更简单地把密钥写进环境变量 `MP2RSS_FEED_KEY`，CLI 会自动读取，不需要写配置文件，这一点对 cron 任务和容器化部署都很友好。

### 第二步：订阅目标公众号

参考[订阅管理指引](/guide/subscription)，贴入任意一篇目标公众号的文章链接完成订阅：

```bash
mp2rss mp subscribe https://mp.weixin.qq.com/s/xxxxxxxxxx
```

需要注意，首次订阅不会回溯历史文章，只从订阅时刻起收录该号后续发布的新文章，联调脚本时建议先选一个近期更新较频繁的号，避免长时间看不到新数据以为脚本有问题。

### 第三步：写一个检测新文章的脚本

核心逻辑很简单：每次运行时拉取该公众号最新一批文章，和上次记录的文章 ID 做对比，只处理没见过的部分。用 CLI 配合 `jq` 可以这样写：

```bash
#!/bin/bash
MP_ID=2234567
STATE_FILE="/var/lib/mp2rss/${MP_ID}.last"
LAST_SEEN=$(cat "$STATE_FILE" 2>/dev/null || echo "")

mp2rss mp articles "$MP_ID" -o json | jq -c '.items[]' | while read -r item; do
  ARTICLE_ID=$(echo "$item" | jq -r '.articleId')
  if [ "$ARTICLE_ID" = "$LAST_SEEN" ]; then
    break
  fi
  TITLE=$(echo "$item" | jq -r '.title')
  URL=$(echo "$item" | jq -r '.originalUrl')
  # 这里换成自己的处理逻辑：写数据库、追加到 Git 仓库、发 webhook
  echo "新文章：$TITLE $URL"
done

mp2rss mp articles "$MP_ID" -o json | jq -r '.items[0].articleId' > "$STATE_FILE"
```

把这段脚本挂进 cron（比如每 30 分钟跑一次），就有了一个不依赖任何第三方平台的最小化管道。如果习惯用 Python、Node 等语言而不想额外依赖 CLI 二进制，同样的数据可以直接用 HTTP 调用拿到：

```bash
curl "https://mp2rss.bugcode.dev/open-api/subscriptions/2234567/articles?page=1&pageSize=20" \
  -H "Authorization: Bearer $MP2RSS_FEED_KEY"
```

返回的每篇文章自带 `contentMarkdown` 字段（正文 Markdown 原文），如果只需要标题和链接做提醒，忽略这个字段即可；如果需要把正文一并归档进自己的知识库或静态站点，直接读取这个字段就是完整正文，不需要再另外抓取原文页面解析 HTML。完整字段与错误码说明见 [Open API 文档](/api/)，CLI 全部子命令与退出码对照表见[命令参考](/cli/commands)。

### 第四步：按需扩展到多个公众号和 X 账号

如果需要同时监测多个公众号，脚本层面只需要把 `MP_ID` 换成一个列表循环执行；配额层面，[会员与计费](/guide/membership)按订阅数分档，不同套餐功能一致，只是订阅上限不同。除了公众号，同一套 Feed 密钥也支持订阅 X（Twitter）账号，用 `mp2rss x list` 拿到已订阅账号的 `xUserId` 后，可以用同样的思路调用 `mp2rss x posts` 或 `mp2rss x articles` 把两类信息源统一进一个脚本管道，不需要为不同信源分别搭建抓取逻辑。

## 常见问题

**为什么不直接用无代码平台（n8n / Zapier），而要自己写脚本？**
两者不冲突，取决于团队已有的技术栈。已经习惯用 cron、systemd timer 或 CI 定时任务维护自动化逻辑的团队，用 CLI 或 Open API 直接写脚本更轻量，不需要额外维护一个可视化编排平台的账号和节点配置；偏好无代码方式的场景可以参考 RSS 触发器的接入方法。

**CLI 和直接调用 Open API，应该选哪个？**
功能上等价，CLI 本质是对 Open API 的封装，额外提供了表格输出、鉴权状态查看等交互便利。追求最少依赖、想直接用 `curl` + `jq` 或者语言原生 HTTP 客户端处理的场景，可以跳过 CLI 直接调 Open API；日常在终端里手动查看订阅、调试的场景，CLI 更省事。

**脚本部署在服务器上，怎么免交互完成鉴权？**
把 Feed 密钥写进环境变量 `MP2RSS_FEED_KEY`，CLI 会自动读取，不需要每次跑 `auth login`，也不需要在服务器上打开浏览器。

**新文章发布后，脚本多久能拉到数据？**
从发文到 Mp2RSS 数据可见平均 2–3 小时，再叠加脚本自身的执行频率（比如 cron 设置的 30 分钟一次），实际检测到新文章的时间是两者叠加的结果。

**订阅一个新公众号后，能马上拉到它过去发的文章吗？**
不能。首次订阅不回溯历史文章，只从订阅时刻起持续收录该号后续发布的新文章，调试脚本时建议先选一个近期更新频繁的号做测试。

---

订阅上限按套餐档位区分：49 元/月 50 个订阅、99 元/月 100 个、399 元/月 400 个，功能一致仅订阅上限不同，具体见[会员与计费](/guide/membership)。想快速上手，可以从[快速开始](/guide/quick-start)开始，几分钟内完成第一次订阅并拿到 Feed 密钥；也可以直接访问 [Mp2RSS 产品主站](https://mp2rss.bugcode.dev)，贴一篇公众号文章链接试试效果。
