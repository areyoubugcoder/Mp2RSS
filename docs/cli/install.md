# 安装

`mp2rss` 提供四种安装方式，可按场景任选其一。

## 系统要求

- **操作系统**：macOS、Linux、Windows（amd64 / arm64）。
- **架构**：x86_64（amd64）或 arm64。
- **可选依赖**：
  - `install.sh` 一键安装：`curl` 或 `wget` + `tar`；macOS / Linux。
  - `npm` 包装：Node.js ≥ 18。
  - 源码构建：Go ≥ 1.21。
  - 直接下载：`tar`（unix）或解压 zip 的工具（Windows）。

::: tip 哪种装法适合我？
- 桌面 / 开发机首次安装 → **install.sh 一键安装**。
- Node 工具链已就绪、想随 `package.json` 锁定版本 → **npm 包装**。
- 离线分发 / 公司内部镜像 / CI 缓存 → **直接下载**。
- 想跟踪未发布的 `main` → **源码构建**。
:::

资产命名约定（所有安装方式底层都拉这些文件）：

```
mp2rss-cli_<version>_<goos>_<goarch>.tar.gz   # darwin / linux
mp2rss-cli_<version>_<goos>_<goarch>.zip      # windows
checksums.txt                                 # 每个 release 配套的 SHA-256 清单
```

每个 release 同时附带 `checksums.txt`，建议保留校验环节，避免镜像被篡改。

## 方式一：install.sh 一键安装（推荐 macOS / Linux）

```bash
curl -fsSL https://mp2rss.com/install.sh | sh
```

脚本会：

1. 探测当前 OS / 架构；
2. 通过 `api.github.com/.../releases/latest` 解析最新 tag；
3. 选写优先级 `$HOME/.local/bin` → `$HOME/bin` → `/usr/local/bin`（前者权限不足时回退，最后一档可能需要 `sudo`）；
4. 下载对应平台的 `tar.gz` 并对照 `checksums.txt` 校验 SHA-256；
5. 解压、`chmod 755`，并尝试 `mp2rss --version` 自检。

### 环境变量覆盖

```bash
# 指定安装目录
curl -fsSL https://mp2rss.com/install.sh | INSTALL_DIR="$HOME/.local/bin" sh

# 指定版本（默认最新）
curl -fsSL https://mp2rss.com/install.sh | VERSION=v0.2.0 sh

# 跳过 SHA-256 校验（仅在受信镜像 / 离线环境下使用）
curl -fsSL https://mp2rss.com/install.sh | NO_VERIFY=1 sh

# 组合使用
curl -fsSL https://mp2rss.com/install.sh \
  | INSTALL_DIR="$HOME/.local/bin" VERSION=v0.2.0 NO_VERIFY=1 sh
```

### 卸载

```bash
# 1. 删除二进制（脚本提示的 install_dir）
rm "$HOME/.local/bin/mp2rss"

# 2. 清理本地配置（可选）
rm -rf ~/.mp2rss
```

::: warning Windows 用户
`install.sh` 仅覆盖 macOS / Linux。Windows 请使用 [方式二：npm 包装](#方式二-npm-包装) 或 [方式三：直接下载](#方式三-直接下载-github-releases)。
:::

## 方式二：npm 包装

适合 Node 工具链已就绪、CI 中按 `package.json` 锁定版本的场景。Node ≥ 18。

```bash
# pnpm
pnpm add -g @mp2rss/cli

# npm
npm install -g @mp2rss/cli

# yarn
yarn global add @mp2rss/cli
```

`postinstall` 会按当前 OS / 架构从 GitHub Releases 拉对应二进制，并对照 `checksums.txt` 校验 SHA-256。可通过环境变量微调：

```bash
# 指定版本（覆盖 package.json）
MP2RSS_VERSION=0.2.0 pnpm add -g @mp2rss/cli

# 跳过 SHA-256 校验
MP2RSS_NO_VERIFY=1 pnpm add -g @mp2rss/cli
```

### 卸载

```bash
pnpm rm -g @mp2rss/cli     # 或 npm uninstall -g @mp2rss/cli / yarn global remove @mp2rss/cli
rm -rf ~/.mp2rss           # 清理本地配置（可选）
```

## 方式三：直接下载（GitHub Releases）

[最新 release 页面](https://github.com/areyoubugcoder/mp2rss-cli/releases/latest) 一律附带四个平台归档 + `checksums.txt`。

### 自动选择最新版本（脚本片段）

```bash
REPO=areyoubugcoder/mp2rss-cli
TAG=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
  | sed -n 's/.*"tag_name":[[:space:]]*"\(v[^"]*\)".*/\1/p' | head -n1)
SEMVER=${TAG#v}
# 按本机平台替换 darwin/amd64 → 你的目标
OS=darwin ARCH=arm64
ASSET="mp2rss-cli_${SEMVER}_${OS}_${ARCH}.tar.gz"

curl -L -o "$ASSET" \
  "https://github.com/$REPO/releases/download/$TAG/$ASSET"
curl -L -o checksums.txt \
  "https://github.com/$REPO/releases/download/$TAG/checksums.txt"

# 校验
shasum -a 256 -c <(grep " $ASSET\$" checksums.txt)

# 解压并安装
tar -xzf "$ASSET" mp2rss
sudo install -m 0755 mp2rss /usr/local/bin/mp2rss
mp2rss --version
```

### 平台对应资产

| 平台 | 资产 |
| ---- | ---- |
| macOS Apple Silicon | `mp2rss-cli_<version>_darwin_arm64.tar.gz` |
| macOS Intel | `mp2rss-cli_<version>_darwin_amd64.tar.gz` |
| Linux x86_64 | `mp2rss-cli_<version>_linux_amd64.tar.gz` |
| Linux arm64 | `mp2rss-cli_<version>_linux_arm64.tar.gz` |
| Windows x86_64 | `mp2rss-cli_<version>_windows_amd64.zip` |
| Windows arm64 | `mp2rss-cli_<version>_windows_arm64.zip` |

Windows 用 `tar -xf <asset>.zip mp2rss.exe`（Windows 10+ 内置 `tar` 支持 zip），或资源管理器解压。

### 卸载

```bash
# unix
sudo rm /usr/local/bin/mp2rss

# Windows（PowerShell）
Remove-Item "$Env:USERPROFILE\bin\mp2rss.exe"

# 清理本地配置（可选）
rm -rf ~/.mp2rss
```

## 方式四：源码构建

适合需要跟踪未发布 `main`、自行打包、或为新平台编译的场景。需要 Go ≥ 1.21。

```bash
git clone https://github.com/areyoubugcoder/mp2rss-cli.git
cd mp2rss-cli
make build              # 等价于 go build -trimpath -ldflags="-s -w" -o mp2rss .
./mp2rss --version
```

把产物放到 `PATH`：

```bash
sudo install -m 0755 mp2rss /usr/local/bin/mp2rss
```

::: tip 关于体积
默认 `go build` 出来约 12–14 MB；`make build` 会附加 `-trimpath -ldflags="-s -w"`，压缩到 ~10 MB。
:::

### 卸载

```bash
sudo rm /usr/local/bin/mp2rss
rm -rf ~/.mp2rss          # 清理本地配置（可选）
# 仓库目录直接删除即可
```

## 升级

参见 [FAQ → 如何更新到最新版本](./faq#如何更新到最新版本)：

- `mp2rss update` 自更新（推荐，所有安装方式通用）
- `pnpm up -g @mp2rss/cli`（npm 安装的场景）
- 重跑 `install.sh`（脚本安装的场景）

## 下一步

- [登录](./login)：完成第一次鉴权。
- [命令参考](./commands)：查看所有可用命令。
