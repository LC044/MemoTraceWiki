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
          text: "1. 安装教程",
          icon: "blog",
          link: "install",
        },
        {
          text: "2. 解析数据",
          icon: "blog",
          link: "parser-db",
        },
        {
          text: "3. 导出数据",
          icon: "blog",
          link: "exporter",
        },
        {
          text: "4. 语音转文字",
          icon: "blog",
          link: "audio-to-text",
        },
        {
          text: "5. 保存数据",
          icon: "blog",
          link: "save",
        },
        {
          text: "6. 账号管理",
          icon: "blog",
          link: "manage-accounts",
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
          text: "数据构建",
          icon: "read",
          link: "dataset",
        },
        {
          text: "训练指南1",
          icon: "read",
          link: "train",
        },
        {
          text: "训练指南2",
          icon: "read",
          link: "train2",
        },
        {
          text: "部署运行",
          icon: "read",
          link: "deploy",
        }
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
        {
          text: "弹窗报错",
          icon: "blog",
          link: "unknown",
        },
        {
          text: "会员相关",
          icon: "blog",
          link: "vip-faq",
        },
      ],
    },
    {
      text: "更新日志",
      icon: "read",
      link: "posts/update-log",
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
