# API 列表

Mp2RSS Open API 面向第三方脚本与自动化场景，统一以 `Authorization: Bearer <feed-key>` 鉴权，覆盖 **MP（公众号）订阅 CRUD + 文章拉取**，以及**已订阅 X（Twitter）账号的推文 / 长文拉取**。

> **X 相关能力的边界**：本 API **不暴露** X 账号搜索与 X 订阅 / 取消订阅端点。脚本场景应先在 Web 控制台完成 X 账号搜索与订阅，再用本 API 的 `GET /open-api/subscriptions?sourceType=x` 列出已订阅账号、并通过 `GET /open-api/x/{xUserId}/posts | /articles` 拉取内容。

## 信息源类型（sourceType） {#source-type}

订阅列表接口（`GET /open-api/subscriptions`）返回 **MP + X 合并列表**，items 是 discriminated union，按 `sourceType` 字段区分：

| sourceType | 含义 | 业务键 |
| ---------- | ---- | ------ |
| `mp`       | 微信公众号订阅 | `mpId`（整数） |
| `x`        | X（Twitter）账号订阅 | `xUserId`（字符串，X 的 user_id 数字串） |

MP 的订阅 CRUD 走 `/open-api/subscriptions/*`；X 的订阅 / 取消订阅请在 Web 控制台完成。订阅配额 MP + X 合并计算，上限由所购[套餐档位](../guide/membership.md)决定。

## HTTP 状态码说明 {#http-status-codes}

本 API 遵循 RESTful 设计规范，使用标准 HTTP 状态码表示请求结果。

### 成功状态码
| 状态码 | 描述 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功，返回请求的数据 |
| 204 | No Content | 请求成功，但无返回内容（如订阅、取消订阅等写类操作） |

### 客户端错误状态码
| 状态码 | 描述 | 使用场景 |
|--------|------|----------|
| 400 | Bad Request | 请求参数错误或格式不正确；或订阅已达上限 |
| 401 | Unauthorized | 未授权或凭据失效 |
| 403 | Forbidden | 会员已过期 |
| 404 | Not Found | 请求的资源不存在（含未订阅校验） |
| 429 | Too Many Requests | 触发限流（详见下文「限流策略」） |

### 服务器错误状态码
| 状态码 | 描述 | 使用场景 |
|--------|------|----------|
| 500 | Internal Server Error | 服务器内部错误 |
| 503 | Service Unavailable | 数据源暂时不可用 |

### 错误响应格式
当请求失败时，响应体将包含以下格式的错误信息：
```JSON
{
    "errorMessage": "错误描述信息"
}
```

成功的写类操作（POST / DELETE）统一返回 **`204 No Content`**，无响应体。

## 限流提示 {#rate-limit}

服务端可能返回 `429 Too Many Requests`，响应携带 `Retry-After` header；客户端应按该 header 退避后重试，常规调用不会触达。

## API 地址 {#api-base-url}

```
https://mp2rss.bugcode.dev
```

完整地址示例:
```
https://mp2rss.bugcode.dev/open-api/subscriptions
```

## API 鉴权 {#api-auth}

API 鉴权方式采用 Bearer Token 方式，使用控制台中的 Feed 密钥作为 token，每个 API 请求时请务必携带。示例:

```JSON
{
    "Authorization": "Bearer {your_feed_key}"
}
```

> Feed 密钥同时是 Feed 公开链接中的访问凭据，泄漏后请立即在控制台「账户设置」一键重置。

---

# 订阅列表（MP + X 合并） {#subscriptions-section}

## 查询订阅列表（GET，MP + X 合并） {#list-subscriptions}

**path:** <CopyPath path="/open-api/subscriptions" />

分页查询当前用户全部订阅（MP + X 合并）。可通过 `sourceType` 过滤；响应中 `items` 按 `sourceType` 字段区分 MP / X 两种形态。

Query 参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :----: | :---- |
| q | String | ❌ |  | 按公众号名 / X displayName 关键字模糊匹配 |
| sourceType | String | ❌ | `all` | `mp` / `x` / `all`，其他取值返回 400 |
| page | Integer | ❌ | 1 | 页码 |
| pageSize | Integer | ❌ | 20 | 每页记录数(最大 50) |

响应参数（MP 形态）:
| 参数名称 | 参数类型 | 是否必传 | 描述 |
| ------- | :------- | :----: | :---- |
| items[].sourceType | String | ✅ | 固定为 `"mp"` |
| items[].mpId | Integer | ✅ | 公众号 ID |
| items[].mpName | String | ✅ | 公众号名称 |
| items[].mpAvatarUrl | String? | ❌ | 公众号头像 URL，可能为 null |
| items[].createdAt | Integer | ✅ | 订阅创建时间（UTC ms） |
| items[].mpLastArticleAt | Integer? | ❌ | 公众号最新文章收录时间（UTC ms），无内容时 null |

响应参数（X 形态）:
| 参数名称 | 参数类型 | 是否必传 | 描述 |
| ------- | :------- | :----: | :---- |
| items[].sourceType | String | ✅ | 固定为 `"x"` |
| items[].xUserId | String | ✅ | X 账号 user_id（数字串） |
| items[].xUsername | String | ✅ | X handle，例如 `elonmusk` |
| items[].xDisplayName | String | ✅ | X 显示名 |
| items[].xAvatarUrl | String? | ❌ | 头像 URL，可能为 null |
| items[].xVerified | Boolean | ✅ | 是否已认证 |
| items[].createdAt | Integer | ✅ | 订阅创建时间（UTC ms） |
| items[].xLastItemAt | Integer? | ❌ | 该 X 账号最新一条推文 / 长文收录时间（UTC ms），无内容时 null |

公共字段:
| 参数名称 | 参数类型 | 是否必传 | 描述 |
| ------- | :------- | :----: | :---- |
| total | Integer | ✅ | 总记录数 |
| page | Integer | ✅ | 当前页码 |
| pageSize | Integer | ✅ | 每页记录数 |

**HTTP状态码:**
- `200 OK` - 查询成功
- `400 Bad Request` - 请求参数错误（如 pageSize 超过 50、sourceType 取值非法）
- `401 Unauthorized` - Feed 密钥缺失或无效
- `403 Forbidden` - 会员已过期
- `429 Too Many Requests` - 触发服务端限流，按 `Retry-After` 退避后重试

**成功响应示例 (200)：**
```JSON
{
    "items": [
        {
            "sourceType": "mp",
            "mpId": 2234567,
            "mpName": "公众号 A",
            "mpAvatarUrl": null,
            "createdAt": 1776553200000,
            "mpLastArticleAt": 1776854096000
        },
        {
            "sourceType": "x",
            "xUserId": "44196397",
            "xUsername": "elonmusk",
            "xDisplayName": "Elon Musk",
            "xAvatarUrl": "https://pbs.twimg.com/profile_images/...",
            "xVerified": true,
            "createdAt": 1776640000000,
            "xLastItemAt": 1776854096000
        }
    ],
    "total": 2,
    "page": 1,
    "pageSize": 20
}
```

**curl 示例：**
```bash
# 默认拿全部订阅（MP + X 合并）
curl "https://mp2rss.bugcode.dev/open-api/subscriptions?page=1&pageSize=20" \
  -H "Authorization: Bearer $FEED_KEY"

# 仅 X 订阅
curl "https://mp2rss.bugcode.dev/open-api/subscriptions?sourceType=x" \
  -H "Authorization: Bearer $FEED_KEY"
```

**错误响应示例 (401)：**
```JSON
{
    "errorMessage": "Feed key is invalid or revoked"
}
```

---

# MP（公众号）信息源 {#mp-section}

## 通过文章 URL 订阅公众号（POST） {#mp-subscribe}

**path:** <CopyPath path="/open-api/subscriptions" />

服务端接收一篇公众号文章 URL，自动识别其来源公众号并登记订阅。批量订阅请客户端自行循环调用。

请求参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :---- | :---- |
| articleUrl | String | ✅ |  | 任意一篇公众号文章的合法 URL |

请求示例:
```JSON
{
    "articleUrl": "https://mp.weixin.qq.com/s/xxxxxxxxx"
}
```

**HTTP状态码:**
- `204 No Content` - 订阅成功（含重复订阅，相同请求多次调用结果一致）
- `400 Bad Request` - 请求参数错误（如 URL 格式不正确）
- `400 Bad Request` - 已达订阅上限（MP + X 合并计算）
- `401 Unauthorized` - Feed 密钥缺失或无效
- `404 Not Found` - 文章 URL 无法识别到对应公众号
- `429 Too Many Requests` - 触发服务端限流，按 `Retry-After` 退避后重试
- `503 Service Unavailable` - 数据源暂时不可用

**curl 示例：**
```bash
curl -i -X POST "https://mp2rss.bugcode.dev/open-api/subscriptions" \
  -H "Authorization: Bearer $FEED_KEY" \
  -H "Content-Type: application/json" \
  -d '{"articleUrl":"https://mp.weixin.qq.com/s/xxxxxxxxx"}'
# → HTTP/1.1 204 No Content
```

**错误响应示例 (400)：**
```JSON
{
    "errorMessage": "Subscription limit reached"
}
```

## 取消订阅公众号（DELETE） {#mp-unsubscribe}

**path:** <CopyPath path="/open-api/subscriptions/{mpId}" />

> 该端点**仅处理 MP（公众号）订阅**。X 订阅 / 取消订阅请在 Web 控制台完成，本 API 不暴露。

路径参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :---- | :---- |
| mpId | Integer | ✅ |  | 公众号 ID |

**HTTP状态码:**
- `204 No Content` - 取消成功（含重复取消，相同请求多次调用结果一致）
- `400 Bad Request` - 请求参数错误（如 mpId 非正整数）
- `401 Unauthorized` - Feed 密钥缺失或无效
- `429 Too Many Requests` - 触发服务端限流，按 `Retry-After` 退避后重试

**curl 示例：**
```bash
curl -i -X DELETE "https://mp2rss.bugcode.dev/open-api/subscriptions/2234567" \
  -H "Authorization: Bearer $FEED_KEY"
# → HTTP/1.1 204 No Content
```

## 查询公众号的文章列表（GET） {#mp-articles}

**path:** <CopyPath path="/open-api/subscriptions/{mpId}/articles" />

按订阅的公众号分页查询文章。**仅允许查询当前账户已订阅的公众号**；未订阅公众号会返回 404。

路径参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :---- | :---- |
| mpId | Integer | ✅ |  | 公众号 ID |

Query 参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :----: | :---- |
| page | Integer | ❌ | 1 | 页码 |
| pageSize | Integer | ❌ | 100 | 每页记录数(最大 100) |

响应参数:
| 参数名称 | 参数类型 | 是否必传 | 描述 |
| ------- | :------- | :----: | :---- |
| items[].mpId | Integer | ✅ | 所属公众号 ID |
| items[].articleId | String | ✅ | 文章业务 ID |
| items[].title | String | ✅ | 文章标题 |
| items[].summary | String | ✅ | 文章摘要 |
| items[].coverImageUrl | String? | ❌ | 封面图 URL |
| items[].originalUrl | String | ✅ | 原文链接 |
| items[].contentMarkdown | String? | ❌ | 正文 Markdown 原文 |
| items[].publishedAt | Integer | ✅ | 发布时间(UTC 毫秒) |
| items[].updatedAt | Integer | ✅ | 更新时间(UTC 毫秒) |

> 列表按 `publishedAt DESC` 排序；契约**不返回 `total`**，根据 `items.length < pageSize` 判断是否到达末页。

**HTTP状态码:**
- `200 OK` - 查询成功
- `400 Bad Request` - 请求参数错误（如 pageSize 超过 100）
- `401 Unauthorized` - Feed 密钥缺失或无效
- `404 Not Found` - 指定公众号未被当前账户订阅
- `429 Too Many Requests` - 触发服务端限流，按 `Retry-After` 退避后重试

**curl 示例：**
```bash
curl "https://mp2rss.bugcode.dev/open-api/subscriptions/2234567/articles?page=1&pageSize=100" \
  -H "Authorization: Bearer $FEED_KEY"
```

**成功响应示例 (200)：**
```JSON
{
    "items": [
        {
            "mpId": 2234567,
            "articleId": "a1",
            "title": "Hello RSS",
            "summary": "文章摘要",
            "coverImageUrl": null,
            "originalUrl": "https://mp.weixin.qq.com/s/xxxxxxxxx",
            "contentMarkdown": "# Hi\n\n这是一篇测试文章。",
            "publishedAt": 1744886400000,
            "updatedAt": 1744886500000
        }
    ]
}
```

**错误响应示例 (404)：**
```JSON
{
    "errorMessage": "MP account is not subscribed"
}
```

---

# X（Twitter）信息源 {#x-section}

X 信息源全部读类端点挂在 `/open-api/x/*` 子路径下。本 API **不暴露 X 账号搜索与 X 订阅 / 取消订阅端点**——请先在 Web 控制台完成 X 账号搜索与订阅，再使用下列读类端点拉取内容。

> 为什么需要 `xUserId`？X handle 可变更，`xUserId` 才是 X 平台上稳定的唯一标识。可通过 [`GET /open-api/subscriptions?sourceType=x`](#list-subscriptions) 列出已订阅 X 账号并取 `xUserId`。

## 拉取 X 账号的推文列表（GET） {#x-posts}

**path:** <CopyPath path="/open-api/x/{xUserId}/posts" />

分页拉取已订阅 X 账号的推文流（按 `postedAt DESC`）。**仅允许查询当前账户已订阅的 X 账号**；未订阅会返回 404。

> 返回的是 **结构化原始数据**（嵌套对象 / 数组），供脚本与自定义渲染消费；如果只是想在阅读器里看，请用 Feed 公开层 `/feed/{token}/{rss|atom|json}/x-posts/...` 渲染好的 HTML 形态。

路径参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :---- | :---- |
| xUserId | String | ✅ |  | X 账号 user_id，长度 1-64 |

Query 参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :----: | :---- |
| page | Integer | ❌ | 1 | 页码 |
| pageSize | Integer | ❌ | 20 | 每页记录数(最大 50) |

响应参数:
| 参数名称 | 参数类型 | 是否必传 | 描述 |
| ------- | :------- | :----: | :---- |
| items[].postId | String | ✅ | 推文业务 ID |
| items[].content | String | ✅ | 推文正文（明文，未渲染 HTML） |
| items[].media | array[object] | ✅ | 媒体附件数组，已 JSON.parse；无 / 解析失败 → `[]` |
| items[].media[].url | String | ✅ | 媒体资源 URL |
| items[].media[].type | String | ✅ | 媒体类型（`photo` / `video` / `animated_gif` 等） |
| items[].retweetedPost | object? | ❌ | 转推的原推文对象；无则 null |
| items[].quotedPost | object? | ❌ | 引用的推文对象；无则 null |
| items[].threadPosts | array[object] | ✅ | Thread 系列推文数组；无则 `[]` |
| items[].postedAt | Integer | ✅ | 发布时间(UTC 毫秒) |
| total | Integer | ✅ | 总记录数 |
| page | Integer | ✅ | 当前页码 |
| pageSize | Integer | ✅ | 每页记录数 |

**HTTP状态码:**
- `200 OK` - 查询成功
- `400 Bad Request` - 请求参数错误（xUserId 超长 / pageSize 超 50）
- `401 Unauthorized` - Feed 密钥缺失或无效
- `404 Not Found` - `X account is not subscribed`
- `429 Too Many Requests` - 触发服务端限流，按 `Retry-After` 退避后重试

**curl 示例：**
```bash
curl "https://mp2rss.bugcode.dev/open-api/x/44196397/posts?page=1&pageSize=20" \
  -H "Authorization: Bearer $FEED_KEY"
```

**成功响应示例 (200)：**
```JSON
{
    "items": [
        {
            "postId": "1234567890",
            "content": "hello world",
            "media": [{ "url": "https://x.com/img.jpg", "type": "photo" }],
            "retweetedPost": null,
            "quotedPost": { "id": "99", "content": "..." },
            "threadPosts": [{ "content": "reply 1" }],
            "postedAt": 1746864000000
        }
    ],
    "total": 42,
    "page": 1,
    "pageSize": 20
}
```

## 拉取 X 账号的长文列表（GET） {#x-articles}

**path:** <CopyPath path="/open-api/x/{xUserId}/articles" />

分页拉取已订阅 X 账号的长文流（按 `publishedAt DESC`）。订阅闭环校验同 `/open-api/x/{xUserId}/posts`。

路径参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :---- | :---- |
| xUserId | String | ✅ |  | X 账号 user_id，长度 1-64 |

Query 参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :----: | :---- |
| page | Integer | ❌ | 1 | 页码 |
| pageSize | Integer | ❌ | 20 | 每页记录数(最大 50) |

响应参数:
| 参数名称 | 参数类型 | 是否必传 | 描述 |
| ------- | :------- | :----: | :---- |
| items[].url | String | ✅ | 长文原始 URL |
| items[].title | String | ✅ | 标题 |
| items[].description | String | ✅ | 摘要 |
| items[].contentMarkdown | String? | ❌ | 长文 markdown 源串（不渲染 HTML）；可能为 null |
| items[].coverUrl | String? | ❌ | 封面图 URL |
| items[].publishedAt | Integer | ✅ | 发布时间(UTC 毫秒) |
| total | Integer | ✅ | 总记录数 |
| page | Integer | ✅ | 当前页码 |
| pageSize | Integer | ✅ | 每页记录数 |

**HTTP状态码:**
- `200 OK` - 查询成功
- `400 Bad Request` - 请求参数错误（xUserId 超长 / pageSize 超 50）
- `401 Unauthorized` - Feed 密钥缺失或无效
- `404 Not Found` - `X account is not subscribed`
- `429 Too Many Requests` - 触发服务端限流，按 `Retry-After` 退避后重试

**curl 示例：**
```bash
curl "https://mp2rss.bugcode.dev/open-api/x/44196397/articles?page=1&pageSize=20" \
  -H "Authorization: Bearer $FEED_KEY"
```

**成功响应示例 (200)：**
```JSON
{
    "items": [
        {
            "url": "https://x.com/elonmusk/article/...",
            "title": "My take on...",
            "description": "summary",
            "contentMarkdown": "# Heading\n\nfull body markdown source",
            "coverUrl": "https://...",
            "publishedAt": 1747353600000
        }
    ],
    "total": 8,
    "page": 1,
    "pageSize": 20
}
```
