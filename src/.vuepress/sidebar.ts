import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "功能介绍",
      icon: "operate",
      link: "posts/feature"
    },
    {
      text: "使用教程",
      icon: "blog",
      collapsible: true,
      prefix: "posts/deploy/",
      link: "posts/deploy/install",
      children: [
        {
          text: "安装教程",
          icon: "blog",
          link: "install",
        },
        {
          text: "解析数据",
          icon: "blog",
          link: "parser-db",
        },
        {
          text: "导出数据",
          icon: "blog",
          link: "exporter",
        },
      ],
    },
    {
      text: "开发教程",
      icon: "read",
      collapsible: true,
      prefix: "posts/develop/",
      link: "posts/develop/",
      children: [
        {
          text: "源码运行",
          icon: "read",
          link: "technology-info",
        },
      ],
    },
    {
      text: "常见问题",
      icon: "info",
      collapsible: true,
      link: "posts/error/faq",
      prefix: "posts/error/",
      children: [
        {
          text: "弹窗报错",
          icon: "blog",
          link: "unknown",
        },
        {
          text: "问题解答",
          icon: "blog",
          link: "faq",
        },
      ],
    },
    {
      text: "联系我们",
      icon: "at",
      link: "posts/develop/contact",
    },
    {
      text: "AI客服",
      icon: "ask",
      link: "https://chat.memotrace.cn/service/",
    },
  ],
});
