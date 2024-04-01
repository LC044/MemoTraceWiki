import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "功能介绍",
    icon: "operate",
    link: "/posts/feature",
  },
  {
    text: "使用教程",
    icon: "blog",
    link: "/posts/deploy/",
  },
  // "/posts/deploy/",
  // "/posts/Features",
  {
    text: "常见问题",
    icon: "info",
    link: "/posts/error/",
  },
  {
    text: "AI客服",
    icon: "ask",
    link: "https://chat.memotrace.cn/service/",
  },
  {
    text: "官网",
    icon: "context",
    link: "https://memotrace.cn/",
  },
]);
