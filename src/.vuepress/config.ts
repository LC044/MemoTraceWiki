import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "MemoTrace",
  description: "MemoTrace项目的Wiki页",

  theme,
});
