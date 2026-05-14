# API 列表

## HTTP 状态码说明

本 API 遵循 RESTful 设计规范，使用标准 HTTP 状态码表示请求结果。

### 成功状态码
| 状态码 | 描述 | 使用场景 |
|--------|------|----------|
| 200 | OK | 请求成功，返回请求的数据 |
| 204 | No Content | 请求成功，但无返回内容（如新增、删除等写类操作） |

### 客户端错误状态码
| 状态码 | 描述 | 使用场景 |
|--------|------|----------|
| 400 | Bad Request | 请求参数错误或格式不正确 |
| 401 | Unauthorized | 未授权或凭据失效 |
| 404 | Not Found | 请求的资源不存在 |

### 服务器错误状态码
| 状态码 | 描述 | 使用场景 |
|--------|------|----------|
| 500 | Internal Server Error | 服务器内部错误 |
| 503 | Service Unavailable | 上游数据源暂时不可用 |

### 错误响应格式
当请求失败时，响应体将包含以下格式的错误信息：
```JSON
{
    "errorMessage": "错误描述信息"
}
```

## API 地址

```
https://mp2rss.bugcode.dev/api
```

完整地址示例:
```
https://mp2rss.bugcode.dev/api/open-api/subscriptions
```

## API 鉴权

API 鉴权方式采用 Bearer Token 方式，使用控制台中的 Feed 密钥作为 token，每个 API 请求时请务必携带。示例:

```JSON
{
    "Authorization": "Bearer {your_feed_key}"
}
```

## 查询订阅的公众号列表(GET)

**path:** <CopyPath path="/open-api/subscriptions" />

Query 参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :----: | :---- |
| q | String | ❌ |  | 按公众号名称模糊搜索 |
| page | Integer | ❌ | 1 | 页码 |
| pageSize | Integer | ❌ | 20 | 每页记录数(最大 50) |

响应参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :----: | :---- |
| items | array[object] | ✅ |  | 订阅列表 |
| &nbsp; &nbsp; mpId | Integer | ✅ |  | 公众号 ID |
| &nbsp; &nbsp; mpName | String | ✅ |  | 公众号名称 |
| &nbsp; &nbsp; mpAvatarUrl | String | ✅ |  | 公众号头像 URL |
| &nbsp; &nbsp; createdAt | Integer | ✅ |  | 订阅创建时间 |
| &nbsp; &nbsp; mpLastArticleAt | Integer | ❌ |  | 公众号最新文章记录时间 |
| total | Integer | ✅ |  | 总记录数 |
| page | Integer | ✅ |  | 当前页码 |
| pageSize | Integer | ✅ |  | 每页记录数 |

**HTTP状态码:**
- `200 OK` - 查询成功
- `400 Bad Request` - 请求参数错误（如 pageSize 超过 50）
- `401 Unauthorized` - Feed 密钥缺失或无效

**成功响应示例 (200):**
```JSON
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

**错误响应示例 (401):**
```JSON
{
    "errorMessage": "Feed key is invalid or revoked"
}
```

## 通过文章 URL 订阅公众号(POST)

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
- `400 Bad Request` - 已达订阅上限
- `401 Unauthorized` - Feed 密钥缺失或无效
- `404 Not Found` - 文章 URL 无法识别到对应公众号
- `503 Service Unavailable` - 上游数据源暂时不可用

**成功响应示例 (204):**
```
无响应体内容
```

**错误响应示例 (400):**
```JSON
{
    "errorMessage": "Subscription limit reached"
}
```

**错误响应示例 (404):**
```JSON
{
    "errorMessage": "Article URL could not be resolved to an MP account"
}
```

## 取消订阅公众号(DELETE)

**path:** <CopyPath path="/open-api/subscriptions/{mpId}" />

路径参数:
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :---- | :---- |
| mpId | Integer | ✅ |  | 公众号 ID |

**HTTP状态码:**
- `204 No Content` - 取消成功（含重复取消，相同请求多次调用结果一致）
- `400 Bad Request` - 请求参数错误（如 mpId 非正整数）
- `401 Unauthorized` - Feed 密钥缺失或无效

**成功响应示例 (204):**
```
无响应体内容
```

**错误响应示例 (400):**
```JSON
{
    "errorMessage": "Invalid request parameters"
}
```

## 查询公众号的文章列表(GET)

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
| 参数名称 | 参数类型 | 是否必传 | 默认值 | 描述 |
| ------- | :------- | :----: | :----: | :---- |
| items | array[object] | ✅ |  | 文章列表(按发布时间倒序) |
| &nbsp; &nbsp; mpId | Integer | ✅ |  | 所属公众号 ID |
| &nbsp; &nbsp; articleId | String | ✅ |  | 文章业务 ID |
| &nbsp; &nbsp; title | String | ✅ |  | 文章标题 |
| &nbsp; &nbsp; summary | String | ✅ |  | 文章摘要 |
| &nbsp; &nbsp; coverImageUrl | String | ✅ |  | 封面图 URL |
| &nbsp; &nbsp; originalUrl | String | ✅ |  | 原文链接 |
| &nbsp; &nbsp; contentMarkdown | String | ✅ |  | 正文 Markdown 原文 |
| &nbsp; &nbsp; publishedAt | Integer | ✅ |  | 发布时间(UTC 毫秒) |
| &nbsp; &nbsp; updatedAt | Integer | ✅ |  | 入库更新时间(UTC 毫秒) |

**HTTP状态码:**
- `200 OK` - 查询成功
- `400 Bad Request` - 请求参数错误（如 pageSize 超过 100）
- `401 Unauthorized` - Feed 密钥缺失或无效
- `404 Not Found` - 指定公众号未被当前账户订阅

**成功响应示例 (200):**
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

**错误响应示例 (404):**
```JSON
{
    "errorMessage": "MP account is not subscribed"
}
```
