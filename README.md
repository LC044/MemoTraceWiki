## 参与编写

文档基于 VuePress 生成，本地编写需要安装 Node 和 VuePress

### NodeJS

自行安装

### VuePress 

Clone 本仓库，在目录下执行以下命令安装依赖：

```bash
pnpm install
```

完成后即可修改文档，修改完后使用以下命令本地启动：

```bash
pnpm docs:dev
```

打包

```bash
npm run docs:build
```

### 推荐环境

推荐使用 GitHub Codespaces 编写，仓库页面点击 "Code" -> "Codespaces" -> 直接创建一个 Codespace  
在其中按照上述方式安装依赖并运行调试。

> 若出现`Error: /lib/x86_64-linux-gnu/libstdc++.so.6: version GLIBCXX_3.4.29`的报错，请按照如下文章内容解决：  
> https://zhuanlan.zhihu.com/p/615111375

### 一些规范化标准

- 文件夹和文件的命名：**一律使用全小写，单词直接`-`隔开，如**`config-intro.md`
- 子文件（夹）的命名，**不加前缀**（即文件夹的名称），如：`plugin`文件夹下的，插件列表（文件）称之为`list.md`，文件夹`some-plugin-deploy`
- 由于这是有关于文档的规范化命名，所以任何文件的名称都可以以教程的角度来理解，如`plugin`是有关插件的教程

