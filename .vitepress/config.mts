import { defineConfig } from "vitepress";

const base = "/Mp2RSS/";
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
  description: "把公众号、X（Twitter）等信息源搬进熟悉的阅读器 —— 一处订阅，多端同步，主流 Feed 格式即取即用",
  base,
  lastUpdated: true,
  head: [
    ["link", { rel: "icon", href: `${base}favicon.ico` }],
    ["link", { rel: "apple-touch-icon", href: `${base}apple-touch-icon.png` }],
    ...gaHead,
  ],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "指南", link: "/guide/quick-start" },
      { text: "API 列表", link: "/api/" },
      { text: "CLI", link: "/cli/" },
      { text: "FAQ", link: "/guide/faq" },
      {
        text: "立即使用",
        link: "https://mp2rss.bugcode.dev",
        target: "_blank",
        rel: "noopener",
      },
    ],
    sidebar: {
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
