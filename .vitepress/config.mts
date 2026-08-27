import { defineConfig } from "vitepress";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = "/Mp2RSS/";
const SITE_URL = "https://areyoubugcoder.github.io/Mp2RSS/";
const SITE_TITLE = "Mp2RSS —— 微信公众号文章数据服务";
const SITE_DESCRIPTION =
  "Mp2RSS 提供微信公众号文章数据服务：持续抓取公众号最新文章，沉淀为含 Markdown 正文的结构化数据，以 RSS / Atom / JSON Feed 与 Open API 多种形态交付，支撑舆情分析、投研报告、内容监测、高质量信息收集、个人内容阅读与 AI 工作流；亦支持订阅 X（Twitter）账号。";

// 站点级结构化数据：让搜索引擎与 AI 抓取器明确「这是什么产品、卖什么、多少钱」
const structuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "Mp2RSS 文档",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "zh-CN",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://mp2rss.bugcode.dev/#app",
      name: "Mp2RSS",
      url: "https://mp2rss.bugcode.dev",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description:
        "微信公众号文章数据服务：贴入任意一篇公众号文章链接即可订阅整号，持续抓取新文章并沉淀为含 Markdown 正文的结构化数据，以 RSS 2.0 / Atom 1.0 / JSON Feed 1.1 / OPML 2.0、JSON Open API、CLI 与 AI Agent Skill 多种形态交付，支撑舆情分析、投研报告、内容监测、高质量信息收集与个人内容阅读。",
      featureList: [
        "公众号文章链接反查订阅",
        "RSS 2.0 / Atom 1.0 / JSON Feed 1.1 / OPML 2.0 全格式输出",
        "Open API（JSON）订阅管理与文章拉取，文章含 Markdown 正文",
        "mp2rss CLI 终端接入",
        "AI Agent Skill 联动（Claude Code / Cursor 等）",
        "X（Twitter）账号订阅",
      ],
      offers: [
        {
          "@type": "Offer",
          name: "50 订阅 · 月付",
          price: "49",
          priceCurrency: "CNY",
        },
        {
          "@type": "Offer",
          name: "100 订阅 · 月付",
          price: "99",
          priceCurrency: "CNY",
        },
        {
          "@type": "Offer",
          name: "400 订阅 · 月付",
          price: "399",
          priceCurrency: "CNY",
        },
      ],
    },
  ],
});
// Blog 侧边栏：扫描 docs/blog/posts 下的文章自动生成（文件名须为 YYYY-MM-DD-slug.md），
// 按月分组、时间倒序。每日新增文章只需落一个 md 文件，无需改本配置。
function blogSidebar() {
  const postsDir = fileURLToPath(
    new URL("../docs/blog/posts", import.meta.url),
  );
  const files = fs.existsSync(postsDir)
    ? fs.readdirSync(postsDir).filter((f) => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(f))
    : [];
  const posts = files
    .map((file) => {
      const src = fs.readFileSync(path.join(postsDir, file), "utf-8");
      const title = src.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? file;
      return {
        month: file.slice(0, 7),
        date: file.slice(0, 10),
        text: title,
        link: `/blog/posts/${file.replace(/\.md$/, "")}`,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  const byMonth = new Map<string, typeof posts>();
  for (const post of posts) {
    if (!byMonth.has(post.month)) byMonth.set(post.month, []);
    byMonth.get(post.month)!.push(post);
  }
  return [
    {
      text: "专栏",
      items: [{ text: "全部文章", link: "/blog/" }],
    },
    ...[...byMonth.entries()].map(([month, items]) => ({
      text: month,
      collapsed: false,
      items: items.map(({ text, link }) => ({ text, link })),
    })),
  ];
}

const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || "";
const gaHead = GOOGLE_ANALYTICS_ID
  ? ([
    [
      "script",
      {
        async: "",
        src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
      },
    ],
    [
      "script",
      {},
      `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ANALYTICS_ID}');
        `,
    ],
  ] as any)
  : [];

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",
  title: "Mp2RSS",
  description: SITE_DESCRIPTION,
  base,
  lastUpdated: true,
  sitemap: {
    hostname: SITE_URL,
  },
  head: [
    ["link", { rel: "icon", href: `${base}favicon.ico` }],
    ["link", { rel: "apple-touch-icon", href: `${base}apple-touch-icon.png` }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "公众号文章数据, 公众号数据服务, 公众号文章 API, 公众号 RSS, 微信公众号转 RSS, 公众号文章抓取, 舆情分析数据源, 舆情监测, 投研数据, 内容监测, 公众号 JSON Feed, WeChat RSS, WeChat Official Account API, AI Agent 数据源, Mp2RSS",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Mp2RSS" }],
    ["meta", { property: "og:title", content: SITE_TITLE }],
    ["meta", { property: "og:description", content: SITE_DESCRIPTION }],
    ["meta", { property: "og:url", content: SITE_URL }],
    ["meta", { property: "og:image", content: `${SITE_URL}logo.png` }],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:title", content: SITE_TITLE }],
    ["meta", { name: "twitter:description", content: SITE_DESCRIPTION }],
    ["script", { type: "application/ld+json" }, structuredData],
    ...gaHead,
  ],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "指南", link: "/guide/quick-start" },
      { text: "API 列表", link: "/api/" },
      { text: "CLI", link: "/cli/" },
      { text: "Blog", link: "/blog/" },
      { text: "FAQ", link: "/guide/faq" },
      {
        text: "立即使用",
        link: "https://mp2rss.bugcode.dev",
        target: "_blank",
        rel: "noopener",
      },
    ],
    sidebar: {
      "/blog/": blogSidebar(),
      "/guide/": [
        {
          text: "服务说明",
          items: [
            { text: "快速开始", link: "/guide/quick-start" },
            { text: "服务介绍", link: "/guide/intro" },
            { text: "订阅管理", link: "/guide/subscription" },
            { text: "会员与计费", link: "/guide/membership" },
            { text: "服务条款", link: "/guide/terms-of-service" },
            { text: "FAQ", link: "/guide/faq" },
          ],
        },
        {
          text: "反馈",
          items: [
            {
              text: "Bug 反馈",
              link: "https://github.com/areyoubugcoder/Mp2RSS/issues",
            },
            {
              text: "讨论区",
              link: "https://github.com/areyoubugcoder/Mp2RSS/discussions",
            },
          ],
        },
      ],
      "/api/": [
        {
          text: "通用",
          collapsed: false,
          items: [
            { text: "API 列表", link: "/api/" },
            { text: "信息源类型 sourceType", link: "/api/#source-type" },
            { text: "HTTP 状态码", link: "/api/#http-status-codes" },
            { text: "限流提示", link: "/api/#rate-limit" },
            { text: "API 地址", link: "/api/#api-base-url" },
            { text: "API 鉴权", link: "/api/#api-auth" },
          ],
        },
        {
          text: "订阅列表（MP + X 合并）",
          collapsed: false,
          items: [
            { text: "查询订阅列表（GET）", link: "/api/#list-subscriptions" },
          ],
        },
        {
          text: "公众号（MP）",
          collapsed: false,
          items: [
            { text: "订阅公众号（POST）", link: "/api/#mp-subscribe" },
            { text: "取消订阅公众号（DELETE）", link: "/api/#mp-unsubscribe" },
            { text: "查询公众号文章列表（GET）", link: "/api/#mp-articles" },
          ],
        },
        {
          text: "推特（X / Twitter）",
          collapsed: false,
          items: [
            { text: "拉取 X 推文列表（GET）", link: "/api/#x-posts" },
            { text: "拉取 X 长文列表（GET）", link: "/api/#x-articles" },
          ],
        },
        {
          text: "反馈",
          collapsed: true,
          items: [
            {
              text: "Bug 反馈",
              link: "https://github.com/areyoubugcoder/Mp2RSS/issues",
            },
            {
              text: "讨论区",
              link: "https://github.com/areyoubugcoder/Mp2RSS/discussions",
            },
          ],
        },
      ],
      "/cli/": [
        {
          text: "入门",
          collapsed: false,
          items: [
            { text: "简介", link: "/cli/" },
            { text: "安装", link: "/cli/install" },
            { text: "登录", link: "/cli/login" },
            { text: "FAQ", link: "/cli/faq" },
          ],
        },
        {
          text: "命令参考 · 通用",
          collapsed: false,
          items: [
            { text: "命令参考总览", link: "/cli/commands" },
            { text: "全局 flag", link: "/cli/commands#global-flags" },
            { text: "退出码", link: "/cli/commands#exit-codes" },
            { text: "配置与环境变量", link: "/cli/commands#config-env" },
          ],
        },
        {
          text: "命令参考 · 鉴权 (auth)",
          collapsed: false,
          items: [
            { text: "auth login", link: "/cli/commands#auth-login" },
            { text: "auth logout", link: "/cli/commands#auth-logout" },
            { text: "auth status", link: "/cli/commands#auth-status" },
          ],
        },
        {
          text: "命令参考 · 公众号 (mp)",
          collapsed: false,
          items: [
            { text: "mp list", link: "/cli/commands#mp-list" },
            { text: "mp search", link: "/cli/commands#mp-search" },
            { text: "mp subscribe", link: "/cli/commands#mp-subscribe" },
            { text: "mp remove", link: "/cli/commands#mp-remove" },
            { text: "mp articles", link: "/cli/commands#mp-articles" },
          ],
        },
        {
          text: "命令参考 · 推特 (x)",
          collapsed: false,
          items: [
            { text: "x list", link: "/cli/commands#x-list" },
            { text: "x posts", link: "/cli/commands#x-posts" },
            { text: "x articles", link: "/cli/commands#x-articles" },
          ],
        },
        {
          text: "命令参考 · 维护",
          collapsed: true,
          items: [
            { text: "update", link: "/cli/commands#update" },
          ],
        },
        {
          text: "反馈",
          collapsed: true,
          items: [
            {
              text: "Bug 反馈",
              link: "https://github.com/areyoubugcoder/mp2rss-cli/issues",
            },
            {
              text: "讨论区",
              link: "https://github.com/areyoubugcoder/Mp2RSS/discussions",
            },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/areyoubugcoder/Mp2RSS",
      },
    ],
    search: {
      provider: "local",
    },
  },
});
