# 登录

`mp2rss` 的所有写操作都依赖 **Feed 密钥** 作为凭据。CLI 提供三条登录路径，分别适配桌面、CI / 无头、远程 SSH 三类环境。

无论哪一条路径，CLI 拿到 Feed 密钥后都会：

1. 调一次 `GET /open-api/subscriptions?pageSize=1` 验证密钥有效；
2. 写入本地配置 `~/.mp2rss/config.json`，文件权限 `0600`、目录权限 `0700`；
3. 验证失败则**不写盘**并以退出码 `3` 报 401。

## 路径一：默认（浏览器 + Loopback）

适用于本地有桌面浏览器的环境，体验类似 `gh auth login` / `gcloud auth login`。

```bash
mp2rss auth login
```

执行流程：

1. CLI 在 `127.0.0.1` 上随机选一个 `>1024` 的空闲端口，启动一次性 HTTP server，仅监听 `/cli/callback` 一条路径。
2. CLI 终端打印授权 URL，并尝试自动打开浏览器：

   ```
   https://mp2rss.com/cli/authorize?port=<port>&state=<nonce>&v=<cli-version>
   ```
3. 在浏览器中：
   - 若未登录 Mp2RSS，会先走 GitHub / Google OAuth；
   - 已登录时展示授权卡片，含本次请求的 CLI 版本与本机时间，点击「授权 mp2rss CLI」即可。
4. 网页将 Feed 密钥与 `state` 提交回 CLI 的 loopback，校验通过后写盘，终端显示「✓ 授权成功」，浏览器显示「授权成功，可关闭此页面」。

超时 120 秒未收到回调，CLI 自动退出，请改用下面两条路径。

### 安全要点

- **仅监听 127.0.0.1**：loopback server 不会绑定到外网接口，局域网内其他设备不可达。
- **一次性路由**：server 只接受一次 `/cli/callback` 请求，处理完立刻关闭。
- **Origin 白名单**：仅放行 `https://mp2rss.com`（生产）与本地开发地址。
- **state 防 CSRF**：CLI 每次生成 32 字节随机 nonce，回调若 `state` 不匹配直接拒绝。
- **不打印密钥**：终端只显示「授权成功」字样，Feed 密钥不会以明文出现在 stdout、stderr 或终端历史中。

## 路径二：直接传入 Feed 密钥

适用于 CI、容器、临时机器等没有浏览器的场景，或希望脚本化、不交互登录。

```bash
mp2rss auth login -k <feed-key>
# 或：
mp2rss auth login --feed-key <feed-key>
```

CLI 会立即用该密钥调一次 `/open-api/subscriptions?pageSize=1` 校验，通过后写盘。

::: tip Feed 密钥从哪里获取？
登录 Mp2RSS 控制台后，进入「账户设置」，复制 **Feed 密钥** 即可。每个账户的 Feed 密钥是 64 位十六进制串。
:::

::: warning 避免把密钥写进 shell 历史
推荐使用环境变量加引导的方式：

```bash
read -rs MP2RSS_FEED_KEY      # 输入时不回显
mp2rss auth login -k "$MP2RSS_FEED_KEY"
unset MP2RSS_FEED_KEY
```

或者直接使用环境变量优先级（`MP2RSS_FEED_KEY > 配置文件`），单次执行命令时无需先 `auth login`：

```bash
MP2RSS_FEED_KEY=<feed-key> mp2rss mp list
```

:::

## 路径三：远程 / 无浏览器

适用于通过 SSH 连接的远程开发机：本地没有浏览器，但又不想直接粘贴 Feed 密钥。

```bash
mp2rss auth login --no-browser
```

执行流程：

1. CLI 仅打印授权 URL，**不**起 loopback server、**不**尝试打开浏览器。
2. 把 URL 复制到本地有浏览器的设备打开，完成授权后页面会显示你的 Feed 密钥（一次性显示）。
3. 在远端终端粘贴密钥，CLI 校验后写盘。

整个过程不需要从远端到本地的网络回连。

## 查看登录状态

```bash
mp2rss auth status
```

输出示例（表格）：

```
状态：已登录（来源：env）
API：https://api.mp2rss.com
Feed Key：9f3a2c***
上次校验：2026-05-14 11:23
```

`来源` 字段反映当前 Feed Key 从哪里读取：

- `env`：来自环境变量 `MP2RSS_FEED_KEY`
- `config`：来自 `~/.mp2rss/config.json`
- `none`：未登录

未登录时表格输出：

```
状态：未登录
API：https://api.mp2rss.com
登录：mp2rss auth login
```

JSON 输出：

```bash
mp2rss auth status -o json
```

JSON 示例（字段命名与具体格式以代码实际输出为准）：

```json
{
  "loggedIn": true,
  "source": "env",
  "apiUrl": "https://api.mp2rss.com",
  "feedKeyMasked": "9f3a2c***",
  "lastVerifyAt": 1747194198000
}
```

- `lastVerifyAt`：最近一次密钥校验成功的毫秒级 Unix 时间戳。

::: tip Feed 密钥永远不会明文输出
`auth status` 只显示前 6 个字符 + `***` 的掩码形式。如果需要核对完整密钥，请到 Mp2RSS 控制台「账户设置」查看。
:::

## 退出登录

```bash
mp2rss auth logout
```

清空 `~/.mp2rss/config.json` 中的 `feed_key` 字段，**保留** `api_url` 等其它字段。

## 下一步

- [命令参考](./commands)
- [FAQ](./faq)
