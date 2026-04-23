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
  description: "让订阅微信公众号像订阅播客一样顺畅",
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
      { text: "FAQ", link: "/guide/faq" },
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
          text: "API 说明",
          items: [{ text: "API 列表", link: "/api/" }],
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
