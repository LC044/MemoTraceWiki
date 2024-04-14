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
    
![image.png](https://blog.lc044.love/static/img/218cba631855713e971bb9d264ef7aac.image.webp)

点击获取信息之后，正常情况下所有信息均会自动填充，这时候就直接点击开始启动就行了

![image.png](https://blog.lc044.love/static/img/7b2c7e3528248298080befb2e5e6df1d.image.webp)

- **如果微信路径获取失败就转到第四步**
- **如果wxid或key为none**，多试几次，不行的话先重启电脑再试试，90%都能解决
- **如果显示key error**，有一位大哥将微信文件保存路径修改到其他位置后成功了，注意该路径最好不要包含中文，修改路径之后也记得要重启微信或者重启电脑，实在不行的话可以进群反馈
- **解析出现问题的可以在获取信息之后关闭微信，然后再点击开始启动**

## 3. 设置微信路径(如果已经自动设置好就跳过该步骤)

选择微信->设置->文件管理的微信文件默认路径下的wxid_xxx文件夹

![setting.png](https://blog.lc044.love/static/img/eda24dae22ab39446d92c7c984bcc0b8.setting.webp)

**选择底下这个带有wxid的文件夹**，该wxid必须和前面获取的wxid一致，否则的话会显示密钥错误

![path_select.png](https://blog.lc044.love/static/img/40b7e0ecea92dd1fe0c58ea60ff800f7.path_select.webp)
    
    
## 4. 点击开始启动

成功之后会有弹窗提醒，此时关闭软件重新启动即可

![](https://blog.lc044.love/static/img/6f986cdfa52fa746309c1d12fbc41800.clipboard-2024-04-01.webp)

## 5. 成功后新的数据库存储在./app/DataBase/Msg文件夹下

![image.png](https://blog.lc044.love/static/img/9e8c1a93a2760de73b0aeb02411d8508.image.webp)
    
6. 这些数据库可用普通的SQLite查看器查看：如【[DB Browser for SQLite](https://sqlitebrowser.org/dl/)】建议不懂SQL的就不要看了，应该是看不懂的，重启该软件可直接查看聊天记录

7. 重新启动之后打开是这个界面

![](https://blog.lc044.love/static/img/996d010bdd02242b4776819195f77b9d.clipboard-2024-04-01.webp)

**更多问题请查看 [常见问题解答](/doc/posts/error/faq.html)**
