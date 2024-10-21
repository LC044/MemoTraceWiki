---
head:
  - - meta
    - name: keywords
      content: 保存数据
title: 2. 数据解析教程
icon: info
author: 司小远
date: 2024-04-12
category:
  - 解析数据
index: true
---

# 数据解析教程

## 1. 登录微信

登录要导出数据的微信（不支持微信多开，不支持部分老版本微信）

:::info
想把手机端的微信聊天记录转移到电脑上可以使用微信自带的聊天记录迁移功能<br>
操作步骤：
- 安卓： 手机微信->我->设置->聊天->聊天记录迁移与备份->迁移-> 迁移到电脑微信（迁移完成后**重启微信**）[否则](https://github.com/LC044/WeChatMsg/issues/27)
- iOS： 手机微信->我->设置->通用->聊天记录迁移与备份->迁移-> 迁移到电脑微信（迁移完成后**重启微信**）[否则](https://github.com/LC044/WeChatMsg/issues/27)
- 记得重启微信，因为微信关闭后才会将最新数据写入数据库，所以想获取最新数据请重启微信再启动
- <span style="color:red">**迁移而不是备份、迁移而不是备份、迁移而不是备份；<br>手机微信发起迁移功能、手机微信发起迁移功能、手机微信发起迁移功能；<br>迁移完成后重新登录微信、迁移完成后重新登录微信、迁移完成后重新登录微信<br>重要的事情说三遍**</span>

[查看详细教程](https://mp.weixin.qq.com/s/0Tokq3kPSh9uHDz7L9IhsA)
:::

## 2. 点击获取信息
    
![](https://blog.lc044.love/static/img/cf978db404a25c10826ea1bb6dd61f90.clipboard-2024-09-04.webp)

点击获取信息之后，正常情况下所有信息均会自动填充，这时候就直接点击开始启动就行了

![](https://blog.lc044.love/static/img/acfd191b1ce3e2869b565d3e397a5b65.clipboard-2024-09-04.webp)

- **如果微信路径获取失败就转到第四步**
- **如果wxid或key为none**，多试几次，不行的话先重启电脑再试试，90%都能解决
- **如果显示key error**，有一位大哥将微信文件保存路径修改到其他位置后成功了，注意该路径最好不要包含中文，修改路径之后也记得要重启微信或者重启电脑，实在不行的话可以进群反馈
- **解析出现问题的可以在获取信息之后关闭微信，然后再点击开始启动**

## 3. 设置微信路径(如果已经自动设置好就跳过该步骤)

选择微信->设置->文件管理的微信文件默认路径下的wxid_xxx文件夹（一般以wxid_xxx开头，部分微信为自定义字符串，跟MemoTrace里显示的wxid保持一致即可）

![setting.png](https://blog.lc044.love/static/img/eda24dae22ab39446d92c7c984bcc0b8.setting.webp)

**选择底下这个带有wxid的文件夹**，该wxid必须和前面获取的wxid一致，否则的话会显示密钥错误

![path_select.png](https://blog.lc044.love/static/img/40b7e0ecea92dd1fe0c58ea60ff800f7.path_select.webp)
    
    
## 4. 解析数据\增量解析

- 解析数据：留痕没有该微信账号数据（第一次解析、删除过账号或者手动删除过数据库），选择解析数据，成功之后会有弹窗提醒，点击“OK”即可

- 增量解析：留痕已经有该微信账号数据，且在留痕已登录该账号，选择增量解析，将微信更新数据同步更新至留痕，成功之后会有弹窗提醒，点击“OK”即可

![](https://blog.lc044.love/static/img/bb870f913f9c43e91f18a93504410c13.clipboard-2024-09-04.webp)

## 5. 成功后新的数据库存储在./app/DataBase/Msg/wxid***文件夹下

![](https://blog.lc044.love/static/img/18b157d1f2dbe90a03345154735db594.clipboard-2024-09-04.webp)
    
6. 这些数据库可用普通的SQLite查看器查看：如【[DB Browser for SQLite](https://sqlitebrowser.org/dl/)】建议不懂SQL的就不要看了，应该是看不懂的，重启该软件可直接查看聊天记录

7. 解析数据成功跳转后是这个界面

![](https://blog.lc044.love/static/img/d980364771c09dd5589cc3d7e3a5d414.clipboard-2024-09-04.webp)

**更多问题请查看 [常见问题解答](/doc/posts/error/faq.html)**
