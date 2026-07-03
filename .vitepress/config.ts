import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Flowstride",
  description: "An open source flow first test automation framework",

  ignoreDeadLinks: true,

  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "Flowstride",

    nav: [
      { text: "Guide", link: "/guide/getting-started", activeMatch: "/guide/" },
      {
        text: "Reference",
        link: "/reference/ui-commands",
        activeMatch: "/reference/",
      },
    ],

    sidebar: [
      {
        text: "Introduction & Basics",
        collapsed: false,
        items: [
          { text: "getting-started", link: "/guide/getting-started" },
          { text: "why-flowstride", link: "/guide/why-flowstride" },
          { text: "core-concepts", link: "/guide/core-concepts" },
          { text: "Your First Script", link: "/guide/your-first-script" },
        ],
      },
      {
        text: "DSL Command Dictionary",
        collapsed: false,
        items: [
          { text: "UI Automation Engine", link: "/reference/ui-commands" },
          {
            text: "API & Observability Engine",
            link: "/reference/api-commands",
          },
          {
            text: "Advanced & CLI Reference",
            link: "/reference/advanced-commands",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/heroamogs/flowstride-os" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026-present Samuel Okolo",
    },
  },
});
