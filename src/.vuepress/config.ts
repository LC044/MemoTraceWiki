import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "MemoTrace",
  description: "MemoTrace项目的Wiki页",
  head: [
    // 设置 favor.ico，.vuepress/public 下
    [
        'link', { rel: 'icon', href: '/doc/favicon.ico' }
    ]
  ],
  theme,
});
