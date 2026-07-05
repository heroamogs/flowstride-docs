import { defineConfig } from "vitepress";
import { nav } from "./nav";
import { sidebar } from "./sidebar";

export default defineConfig({
  title: "Flowstride",
  description: "An open source flow first test automation framework",

  ignoreDeadLinks: true,

  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  ],

  themeConfig: {
    logo: "/logo.png",
    siteTitle: "Flowstride",

    nav,

    sidebar,

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/heroamogs/flowstride-os",
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026-present Flowstride (TESTCRAFT TECH)",
    },
  },
});
