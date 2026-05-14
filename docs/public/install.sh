#!/bin/sh
# mp2rss-cli installer.
#
#   curl -fsSL https://raw.githubusercontent.com/areyoubugcoder/mp2rss-cli/main/scripts/install.sh | sh
#   curl -fsSL https://raw.githubusercontent.com/areyoubugcoder/mp2rss-cli/main/scripts/install.sh | INSTALL_DIR=$HOME/bin sh
#   curl -fsSL https://raw.githubusercontent.com/areyoubugcoder/mp2rss-cli/main/scripts/install.sh | VERSION=v0.2.0 NO_VERIFY=1 sh
#
# POSIX sh (compatible with bash 3.2, dash, busybox ash). shellcheck clean.
set -eu

# ----- knobs (env overrides) -----
: "${REPO:=areyoubugcoder/mp2rss-cli}"
: "${BINARY:=mp2rss}"
: "${INSTALL_DIR:=}"
: "${VERSION:=}"
: "${NO_VERIFY:=}"

# ----- pretty output -----
red()    { printf '\033[31m%s\033[0m\n' "$*" >&2; }
green()  { printf '\033[32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[33m%s\033[0m\n' "$*"; }
say()    { printf '%s\n' "$*"; }

die() {
  red "✗ $*"
  exit 1
}

# ----- platform detection -----
detect_os() {
  os=$(uname -s 2>/dev/null || echo unknown)
  case "$os" in
    Darwin) echo "darwin" ;;
    Linux)  echo "linux" ;;
    MINGW*|MSYS*|CYGWIN*) echo "windows" ;;
    *) die "暂不支持的操作系统：$os" ;;
  esac
}

detect_arch() {
  arch=$(uname -m 2>/dev/null || echo unknown)
  case "$arch" in
    x86_64|amd64)  echo "amd64" ;;
    aarch64|arm64) echo "arm64" ;;
    *) die "暂不支持的 CPU 架构：$arch" ;;
  esac
}

# ----- dependency checks -----
need() {
  command -v "$1" >/dev/null 2>&1 || die "找不到必需命令：$1（请先安装）"
}

# need exactly one of (curl, wget); prefer curl
download() {
  url=$1
  dst=$2
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL -o "$dst" "$url" || die "下载失败：$url"
  elif command -v wget >/dev/null 2>&1; then
    wget -q -O "$dst" "$url" || die "下载失败：$url"
  else
    die "需要 curl 或 wget"
  fi
}

# ----- find a writable install dir -----
pick_install_dir() {
  if [ -n "$INSTALL_DIR" ]; then
    echo "$INSTALL_DIR"
    return
  fi
  # prefer ~/.local/bin (no sudo)
  if [ -d "$HOME/.local/bin" ] || mkdir -p "$HOME/.local/bin" 2>/dev/null; then
    if [ -w "$HOME/.local/bin" ]; then
      echo "$HOME/.local/bin"
      return
    fi
  fi
  # fallback ~/bin
  if [ -d "$HOME/bin" ] && [ -w "$HOME/bin" ]; then
    echo "$HOME/bin"
    return
  fi
  # last resort /usr/local/bin (likely needs sudo)
  echo "/usr/local/bin"
}

# ----- main flow -----
goos=$(detect_os)
goarch=$(detect_arch)

if [ "$goos" = "windows" ]; then
  die "Windows 请使用 npm 包装：npm install -g @mp2rss/cli"
fi

api="https://api.github.com/repos/$REPO/releases/latest"

if [ -z "$VERSION" ]; then
  need uname
  say "🔎 查询 $REPO 最新版本…"
  tmp_json=$(mktemp)
  trap 'rm -f "$tmp_json"' EXIT INT TERM
  download "$api" "$tmp_json"
  # parse tag_name without jq
  VERSION=$(sed -n 's/^[[:space:]]*"tag_name"[[:space:]]*:[[:space:]]*"\(v[^"]*\)".*/\1/p' "$tmp_json" | head -n 1)
  rm -f "$tmp_json"
  trap - EXIT INT TERM
  [ -n "$VERSION" ] || die "解析 latest release 失败，请检查网络或手动指定 VERSION=v..."
fi

semver=${VERSION#v}
asset="mp2rss-cli_${semver}_${goos}_${goarch}.tar.gz"
url="https://github.com/$REPO/releases/download/$VERSION/$asset"
checksums_url="https://github.com/$REPO/releases/download/$VERSION/checksums.txt"

say "📦 平台 ${goos}/${goarch}，目标版本 ${VERSION}"

# Download into temp dir
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT INT TERM

say "  ↓ 下载 $asset"
download "$url" "$tmpdir/$asset"

if [ -z "$NO_VERIFY" ]; then
  say "  🔐 校验 SHA-256"
  download "$checksums_url" "$tmpdir/checksums.txt"
  expected=$(awk -v a="$asset" '{
    name=$2; sub(/^\*/, "", name);
    if (name == a) { print $1; exit }
  }' "$tmpdir/checksums.txt")
  [ -n "$expected" ] || die "checksums.txt 中找不到 $asset"

  if command -v sha256sum >/dev/null 2>&1; then
    actual=$(sha256sum "$tmpdir/$asset" | awk '{print $1}')
  elif command -v shasum >/dev/null 2>&1; then
    actual=$(shasum -a 256 "$tmpdir/$asset" | awk '{print $1}')
  else
    yellow "⚠ 未找到 sha256sum / shasum，跳过校验（设 NO_VERIFY=1 也可显式跳过）"
    actual=$expected
  fi
  [ "$actual" = "$expected" ] || die "checksum 不匹配：expected $expected, got $actual"
fi

say "  📂 解压"
need tar
tar -xzf "$tmpdir/$asset" -C "$tmpdir" "$BINARY"
[ -f "$tmpdir/$BINARY" ] || die "归档中未找到 $BINARY 可执行文件"
chmod 755 "$tmpdir/$BINARY"

install_dir=$(pick_install_dir)
mkdir -p "$install_dir" 2>/dev/null || true

target="$install_dir/$BINARY"

if [ -w "$install_dir" ]; then
  mv "$tmpdir/$BINARY" "$target"
else
  yellow "  ⚠ $install_dir 不可写，使用 sudo 安装。"
  sudo mv "$tmpdir/$BINARY" "$target" || die "sudo 安装失败，请改用 INSTALL_DIR=\$HOME/.local/bin 重试"
fi

say ""
green "✓ 已安装到 $target"

# self-check (skip if PATH doesn't include it yet — still surface success)
if "$target" --version >/dev/null 2>&1; then
  ver=$("$target" --version 2>&1 | head -n 1)
  green "  $ver"
else
  yellow "  ⚠ 自检 \"$target --version\" 失败，请手动确认"
fi

# PATH hint
case ":$PATH:" in
  *":$install_dir:"*)
    : # already in PATH
    ;;
  *)
    say ""
    yellow "提示：$install_dir 不在 \$PATH 中。请把以下行加入 ~/.bashrc 或 ~/.zshrc："
    say "  export PATH=\"$install_dir:\$PATH\""
    ;;
esac

say ""
say "下一步：mp2rss auth login"
