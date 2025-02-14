# 未知错误弹窗报错

:::info
聊天记录缺失？只有几个月或者一年的数据？电脑微信里有数据但是导出来没有？<br>
[点击查看解决办法](./faq.md#_3-4-聊天记录缺失)
:::

:::important
**通用的解决方案（怎么办）**
* 删除app/DataBase文件夹（跟exe文件在同一目录）
* 重启微信（退出登录再重新登录）
* 启动Memotrace
:::

## 一、常见报错解决方案

### 1.1 可以进入聊天界面

#### 1. 权限异常，请联系管理员解决

原因： 
1. 网络连接异常（软件打开时需要联网检查一下是不是会员，左上角头像底下显示“VIP/标准版”之后可以断网导出）

2. 解析数据失败，检查一下日志文件看是否发生错误，此时左上角头像显示的是一个小人，不是你的真实头像


### 1.2 未能进入聊天界面

#### 1. OPENSSL_Uplink(00007FF903249C88,08):no OPENSSL_Applink

删除留痕软件 `_internal` 目录下的 `libssl-3-x64.dll` 和 `libcrypto-3-x64.dll` 两个文件

#### 2. No such file or directory: 'app/DataBase/Msg/MSG0.db'

```text
有可能是微信数据库损坏导致的

可能的解决方案：
1. 关闭微信双开
2. 重启微信（删除app/DataBase/Msg文件夹、退出登录再重新登录）
3. 重启电脑
4. 重装微信
```

#### 3. 数据库合并错误(sqlite3.OperationalError: no such table: MSG)

```text
聊天记录迁移的过程中数据未能及时写入数据库，伴随的问题是缺失部分聊天记录

可能的解决方案：
1. 重启微信（删除app/DataBase/Msg文件夹、退出登录再重新登录）
2. 重装微信
```

#### 4. 丢失api-ms-win-core-path-l1-1-0.dll文件

```text
不支持win7，请换用Win10及以上操作系统
```

#### 5. sqlite3.DatabaseError: database disk image is malformed

```text
数据库损坏
解决方案
1. 删除app/DataBase文件夹，退出登录微信
2. 找到微信路径：E:\Documents\WeChat Files\wxid_xxx\Msg
3. 在文件夹里找到Misc.db文件，把这个文件删了
4. 登录微信，在联系人列表里加载好友头像
5. 重新登录微信
6. 重新打开MemoTrace解析数据
```

#### 6. sqlite3.OperationalError: no such table: ContactHeadImg1

重新登录一下微信就好了

![image.png](https://blog.lc044.love/static/img/a5dd90b7614ee0301e8c7a06d059bc48.image.webp)