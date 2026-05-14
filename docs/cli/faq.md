# FAQ

## Feed 密钥在哪里复制？

登录 Mp2RSS 控制台后，进入「账户设置」，**Feed 密钥** 一栏点击复制按钮即可。

如果你只想看 CLI 当前用的密钥前缀，可执行：

```bash
mp2rss auth status
```

输出只会展示前 6 个字符 + `***` 的掩码形式，不会泄露完整密钥。

## 默认登录时浏览器没有自动打开怎么办？

CLI 在终端会同时**打印**完整的授权 URL，复制到浏览器手动打开即可。常见原因：

- 系统没有默认浏览器，或当前 shell 环境变量缺少 `BROWSER`。
- 在远程 SSH / 容器内执行，没有桌面环境——这种情形请改用 [`--no-browser`](./login#路径三-远程-无浏览器) 路径。

## loopback 端口被占用怎么办？

CLI 每次在 `127.0.0.1` 上**随机选一个 `> 1024` 的空闲端口**，正常情况下不会冲突。如果遇到极端冲突，重新执行 `mp2rss auth login` 即可——下一次会重新选端口。

如果你所处的环境有严格的本地防火墙规则（例如企业安全软件拦截了所有未签名进程监听本地端口），请改用：

- `mp2rss auth login -k <feed-key>`，或
- `mp2rss auth login --no-browser`。

## SSH 远程环境如何登录？

参见 [登录 → 路径三](./login#路径三-远程-无浏览器)。简而言之：

```bash
mp2rss auth login --no-browser
```

CLI 会打印授权 URL，在本地有浏览器的设备打开 URL 完成授权，把页面显示的 Feed 密钥粘贴回远端终端即可。整个过程不需要从远端到本地的网络回连。

## JSON 模式下错误为什么走 stdout？

为了**让 `jq` 等管道工具能直接消费错误**。如果错误走 stderr：

```bash
mp2rss mp list -o json | jq '.error // .items'
```

在 stderr 与 stdout 没合并的环境里，`jq` 看不到错误体，只能拿到空输入而失败。把错误也写到 stdout 后，上面这条命令既能在成功时拿到 `items`，也能在失败时拿到 `error`。

错误退出码仍然非零，所以脚本里依然可以用 `$?` 或 `set -e` 控制流程：

```bash
if ! mp2rss mp list -o json > out.json; then
  jq '.error' out.json
fi
```

## 我能把 Feed 密钥放进环境变量吗？

可以。优先级是：

```
--api-key  >  MP2RSS_FEED_KEY  >  ~/.mp2rss/config.json 中的 feed_key
```

例如在 CI 里：

```bash
export MP2RSS_FEED_KEY=$FEED_KEY_SECRET
mp2rss mp list -o json
```

这样不需要先 `auth login` 写盘，也不会留下任何本地状态。

## 我能同时连接到多个 Mp2RSS 实例吗？

可以通过 `--api-url` 和 `--api-key`（或环境变量 `MP2RSS_API_URL` / `MP2RSS_FEED_KEY`）在单次调用中切换。配置文件 `~/.mp2rss/config.json` 只保留一组默认值。

## 配置文件权限是怎么设的？

- 目录 `~/.mp2rss/` 权限 `0700`（仅当前用户可访问）。
- 文件 `~/.mp2rss/config.json` 权限 `0600`（仅当前用户可读写）。

CLI 在写入时会强制设置上述权限。如果权限被外部修改成更宽松的值，下次写入会自动恢复。

## 怎么完全卸载并清理本地痕迹？

```bash
# 1. 退出登录（清掉 feed_key）
mp2rss auth logout

# 2. 删除配置目录
rm -rf ~/.mp2rss

# 3. 从 PATH 中删掉二进制
sudo rm /usr/local/bin/mp2rss   # 或你自己放置的位置
```

## 怎么报 Bug / 提需求？

- 命令行问题：[mp2rss-cli Issues](https://github.com/areyoubugcoder/mp2rss-cli/issues)
- 服务端 / Web 控制台问题：[Mp2RSS Issues](https://github.com/areyoubugcoder/Mp2RSS/issues)
- 想交流功能：[讨论区](https://github.com/areyoubugcoder/Mp2RSS/discussions)
