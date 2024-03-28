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
      link: "posts/deploy/",
    },
    {
      text: "开发教程",
      icon: "blog",
      collapsible: true,
      prefix: "posts/develop/",
      link: "posts/develop/",
      children: [
        {
          text: "源码运行",
          icon: "blog",
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
          text: "问题解答",
          icon: "blog",
          link: "faq",
        },
      ],
    },
    {
      text: "联系我们",
      icon: "blog",
      link: "posts/develop/contact",
    },
  ],
});
