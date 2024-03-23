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
      children: [
        {
          text: "部署QChatGPT",
          icon: "flow",
          prefix:"qchatgpt/",
          link: "qchatgpt/",
          children: [
            {
              text: "手动部署",
              icon: "support",
              link: "manual",
            },
            {
              text: "Docker部署",
              icon: "stack",
              link: "docker",
            },
          ],
        },
        {
          text: "部署消息平台",
          icon: "merge",
          prefix:"platforms/",
          link: "platforms/",
          children: [
            {
              text: "Mirai",
              icon: "support",
              link: "mirai",
            },
            {
              text: "go-cqhttp",
              icon: "state",
              link: "gocq",
            },
            {
              text: "OpenShamrock",
              icon: "mobile",
              link: "shamrock",
            },
            {
              text: "Lagrange.OneBot",
              icon: "light",
              link: "lagrange",
            },
            {
              text: "QQ 官方 API",
              icon: "network",
              link: "official",
            },
            {
              text: "其他兼容的平台",
              icon: "more",
              link: "other",
            }
          ],
        },{
          text: "填写配置信息",
          icon: "class",
          link: "config",
        }
      ],
    },
    {
      text: "开发教程",
      icon: "blog",
      collapsible: true,
      prefix: "posts/deploy/",
      link: "posts/deploy/",
    },
    {
      text: "常见问题",
      icon: "info",
      collapsible: true,
      link: "posts/error/",
      prefix: "posts/error/",
      children: [
        {
          text: "Mirai常见报错",
          icon: "notice",
          link: "mirai",
        },
        {
          text: "go-cqhttp常见报错",
          icon: "list",
          link: "gocq",
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
      icon: "blog",
      link: "posts/develop/contact",
    },
  ],
});
