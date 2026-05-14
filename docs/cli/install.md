# 安装

## 系统要求

- 操作系统：macOS、Linux、Windows 任一现代版本均可。
- 架构：x86_64（amd64）或 arm64。
- 构建工具（仅本地构建需要）：Go 1.22 或更新版本。

## 本地源码构建（当前阶段唯一方式）

阶段一只提供本地源码构建。完整步骤：

```bash
# 1. 克隆仓库
git clone https://github.com/areyoubugcoder/mp2rss-cli.git
cd mp2rss-cli

# 2. 构建二进制（产物即当前目录下的 mp2rss）
go build -o mp2rss .

# 3. 验证
./mp2rss --version
./mp2rss --help
```

把 `mp2rss` 放到 `PATH` 中任意目录（例如 `/usr/local/bin` 或 `~/bin`）后即可全局调用：

```bash
sudo mv mp2rss /usr/local/bin/
mp2rss --version
```

::: tip 关于体积
默认 `go build` 出来的二进制约 12–14 MB。仓库 `Makefile` 中提供了 `make build` 目标，会附加 `-trimpath -ldflags="-s -w"` 等参数进一步压缩到 10 MB 左右。
:::

## 升级

在仓库目录 `git pull` 后重新执行 `go build` 即可。`mp2rss update` 命令将在 v1.x 版本启用，届时支持一键自更新。

## 卸载

把 `mp2rss` 二进制从 `PATH` 中删除即可。配置目录在 `~/.mp2rss/`，如不再使用：

```bash
rm -rf ~/.mp2rss
```

## v1.x 起将支持

以下安装方式会在首个正式版本（v1.x）发布后启用，本页面届时一并补充具体命令与下载链接：

### Homebrew

```bash
# 占位，上线后可用
brew install areyoubugcoder/tap/mp2rss
```

### npm 包装

```bash
# 占位，上线后可用
npm install -g @mp2rss/cli
```

### 一键安装脚本

```bash
# 占位，上线后可用
curl -fsSL https://mp2rss.com/install.sh | sh
```

### GitHub Releases 直接下载

发行版会按平台 / 架构提供独立的归档包与 `checksums.txt`，可在 [Releases](https://github.com/areyoubugcoder/mp2rss-cli/releases) 页面下载并校验。

## 下一步

- [登录](./login)：完成第一次鉴权。
- [命令参考](./commands)：查看所有可用命令。
