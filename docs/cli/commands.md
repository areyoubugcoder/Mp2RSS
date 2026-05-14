# 命令参考

## 全局 flag

适用于所有子命令：

| Flag | 含义 | 默认值 |
| ---- | ---- | ------ |
| `-o, --output {json\|table}` | 输出格式 | `table` |
| `--api-key <key>` | 单次覆盖 Feed 密钥（优先级：环境变量 `MP2RSS_FEED_KEY` > 配置文件） | — |
| `--api-url <url>` | 单次覆盖 API 地址（优先级：`--api-url` > `MP2RSS_API_URL` > 配置 > 默认值） | `https://api.mp2rss.com` |
| `-h, --help` | 查看帮助 | — |
| `--version` | 查看版本 | — |

::: tip JSON 模式错误也走 stdout
所有命令在 `-o json` 模式下，**错误也以 JSON 写入 stdout**（不是 stderr），便于 `jq` 等工具统一处理。错误结构：

```json
{ "error": { "message": "Feed key invalid", "code": 401 } }
```

:::

## 退出码

| 码 | 含义 |
| -- | ---- |
| `0` | 成功 |
| `1` | 通用错误（未分类，例如网络异常） |
| `2` | 参数错误（缺失、格式不正确） |
| `3` | 鉴权失败（Feed 密钥缺失或无效） |
| `4` | 资源不存在（如 mpId 找不到） |
| `5` | 上游服务不可用 |

## `mp2rss auth`

鉴权相关子命令，详细使用见 [登录](./login)。

### `mp2rss auth login`

完成首次登录，把 Feed 密钥写入 `~/.mp2rss/config.json`。

```bash
mp2rss auth login                       # 默认：浏览器 + loopback
mp2rss auth login -k <feed-key>         # 直接传入
mp2rss auth login --feed-key <feed-key> # 同上长写法
mp2rss auth login --no-browser          # 远程 / 无浏览器
```

| Flag | 含义 |
| ---- | ---- |
| `-k, --feed-key <key>` | 跳过浏览器直接落盘 |
| `--no-browser` | 不打开浏览器、不起 loopback，由用户手动粘贴密钥 |

### `mp2rss auth logout`

清空配置中的 `feed_key`，保留 `api_url`。

```bash
mp2rss auth logout
```

### `mp2rss auth status`

显示登录状态、API 地址、Feed 密钥掩码、最近一次成功调用时间。

```bash
mp2rss auth status
mp2rss auth status -o json
```

## `mp2rss mp`

公众号订阅与文章相关子命令。

### `mp2rss mp list`

列出当前账户下的订阅。

```bash
mp2rss mp list
mp2rss mp list -q 公众号                     # 按名称模糊搜索
mp2rss mp list -p 2 --page-size 20           # 分页
mp2rss mp list -o json | jq '.items[].mpName'
```

| Flag | 默认 | 含义 |
| ---- | ---- | ---- |
| `-q, --query <kw>` | — | 按公众号名称模糊匹配 |
| `-p, --page <n>` | `1` | 页码 |
| `--page-size <n>` | `20` | 每页记录数（最大 50） |

**HTTP 映射**：`GET /open-api/subscriptions`

**表格输出示例：**

```
MP_ID    公众号             最新文章               订阅时间
2234567  公众号 A          2026-05-13 09:14      2026-04-20 17:31
2238910  公众号 B          -                     2026-05-01 08:02
```

**JSON 输出示例：**

```json
{
  "items": [
    {
      "mpId": 2234567,
      "mpName": "公众号 A",
      "mpAvatarUrl": null,
      "createdAt": 1776553200000,
      "mpLastArticleAt": 1776854096000
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

### `mp2rss mp search`

`mp list -q <keyword>` 的语法糖。

```bash
mp2rss mp search 公众号
mp2rss mp search 公众号 -p 2
```

| Flag | 默认 | 含义 |
| ---- | ---- | ---- |
| `-p, --page <n>` | `1` | 页码 |
| `--page-size <n>` | `20` | 每页记录数 |

**HTTP 映射**：`GET /open-api/subscriptions?q=<keyword>`

### `mp2rss mp subscribe`

通过任意一篇该公众号的文章链接发起订阅。

```bash
mp2rss mp subscribe https://mp.weixin.qq.com/s/xxxxxxxxxx
```

**HTTP 映射**：`POST /open-api/subscriptions`，body `{ "articleUrl": "<...>" }`，成功返回 204。

**表格输出：**

```
✓ 订阅成功
```

**JSON 输出：**

```json
{ "ok": true, "articleUrl": "https://mp.weixin.qq.com/s/xxxxxxxxxx" }
```

### `mp2rss mp remove`

取消订阅一个公众号。默认会要求交互确认，加 `-y/--yes` 跳过确认。

```bash
mp2rss mp remove 2234567
mp2rss mp remove 2234567 --yes        # 跳过确认（脚本场景）
mp2rss mp remove 2234567 -y           # 同上短写法
```

| Flag | 默认 | 含义 |
| ---- | ---- | ---- |
| `-y, --yes` | `false` | 跳过交互确认 |

**HTTP 映射**：`DELETE /open-api/subscriptions/{mpId}`，成功返回 204。

**表格输出：**

```
✓ 已取消订阅 mpId=2234567
```

**JSON 输出：**

```json
{ "ok": true, "mpId": 2234567 }
```

### `mp2rss mp articles`

查询某公众号的历史文章列表。

```bash
mp2rss mp articles 2234567
mp2rss mp articles 2234567 -p 2 --page-size 100
mp2rss mp articles 2234567 -o json | jq '.items[].title'
```

| Flag | 默认 | 含义 |
| ---- | ---- | ---- |
| `-p, --page <n>` | `1` | 页码 |
| `--page-size <n>` | `100` | 每页记录数 |

**HTTP 映射**：`GET /open-api/subscriptions/{mpId}/articles`

**表格输出示例：**

```
发布时间             标题                                    链接
2026-05-13 09:14    示例文章标题 A                          https://mp.weixin.qq.com/s/aaa
2026-05-10 18:02    示例文章标题 B（标题超长会被截断…）       https://mp.weixin.qq.com/s/bbb
```

**JSON 输出示例：**

```json
{
  "items": [
    {
      "mpId": 2234567,
      "articleId": "a1",
      "title": "示例文章标题 A",
      "summary": "文章摘要",
      "coverImageUrl": null,
      "originalUrl": "https://mp.weixin.qq.com/s/aaa",
      "contentMarkdown": "# Hi\n\n这是一篇测试文章。",
      "publishedAt": 1776854096000,
      "updatedAt": 1776854100000
    }
  ]
}
```

::: tip
`mp articles` 响应**只含 `items`**，没有 `total / page / pageSize`。如果需要分页元信息，可通过 `--page` / `--page-size` 翻页并自行判断是否到达末页（items 数量小于 `--page-size` 即末页）。
:::

## `mp2rss update`

自更新命令。

```bash
mp2rss update                # 检查并执行更新
mp2rss update --check        # 只检查不更新
mp2rss update --force        # 跳过版本对比强制更新
```

::: warning 当前阶段为占位实现
当前版本执行该命令仅会提示「自更新功能将在 v1.x 版本启用」。完整功能（拉取最新 release 并原子替换）将在 v1.x 上线时启用。
:::

## 配置与环境变量

`~/.mp2rss/config.json` 字段（落盘 schema 保持 snake_case）：

```json
{
  "feed_key": "9f3a2c...（64 位 hex）",
  "api_url": "https://api.mp2rss.com",
  "last_login_at": 1747194198,
  "last_verify_at": 1747194198
}
```

- `last_login_at` / `last_verify_at` 为秒级 Unix 时间戳，分别记录最近一次成功登录与最近一次密钥校验成功的时刻。
- 文件权限自动设为 `0600`、目录权限 `0700`。

环境变量：

| 变量 | 作用 | 优先级 |
| ---- | ---- | ------ |
| `MP2RSS_FEED_KEY` | 覆盖 Feed 密钥 | 高于配置文件、低于 `--api-key` |
| `MP2RSS_API_URL` | 覆盖 API 地址 | 高于配置文件、低于 `--api-url` |

## 下一步

- [FAQ](./faq)
