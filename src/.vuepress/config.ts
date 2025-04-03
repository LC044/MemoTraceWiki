import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import MarkdownItKatex from "markdown-it-katex";

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
        src: 'https://chat.memotrace.cn/api/application/embed?protocol=https&host=chat.memotrace.cn&token=16518b367388aa75'
      }
    ]
  ],
  theme,
  // 省略其他配置
  extendsMarkdown: (md) => {
    md.use(MarkdownItKatex);
  },
});


