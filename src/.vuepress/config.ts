import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/doc/",

  lang: "zh-CN",
  title: "MemoTrace",
  description: "MemoTrace项目的Wiki页",
  head: [
    // 设置 favor.ico，.vuepress/public 下
    [
        'link', { rel: 'icon', href: '/doc/favicon.ico' }
    ],
    [
      'script',
      {
        async: true,
        defer: true,
        src: 'http://kbchat.lc044.love/api/application/embed?protocol=http&host=192.168.1.113:26666&token=16518b367388aa75'
      }
    ]
  ],
  theme,
});
