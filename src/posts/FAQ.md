## 一、支持的平台

* 不支持win7
* 不支持Mac
* 支持Win10、Win11、Python>=3.10(3.10、3.11、3.12)

## 二、常见报错解决方案

### 2.1 未能进入聊天界面

**通用的解决方案**
* 删除app文件夹（跟exe文件在同一目录）
* 重启微信（退出登录再重新登录）
* 启动Memotrace

#### 1. TypeError: unsupported operand type(s) for |: 'type' and 'type'

Python版本不对，使用3.10及以上版本

#### 2. No such file or directory: 'app/DataBase/Msg/MSG0.db'
    
有可能是微信数据库损坏导致的

可能的解决方案：
1. 关闭微信双开
2. 重启微信（删除app/DataBase/Msg文件夹、退出登录再重新登录）
3. 重启电脑
4. 重装微信

#### 3. sqlite3.OperationalError: no such table: MSG

聊天记录迁移的过程中数据未能及时写入数据库，伴随的问题是缺失部分聊天记录

可能的解决方案：
1. 重启微信（删除app/DataBase/Msg文件夹、退出登录再重新登录）
2. 重装微信

#### 4. 丢失api-ms-win-core-path-l1-1-0.dll文件
不支持win7，请换用Win10及以上操作系统
    
#### 5. sqlite3.DatabaseError: database disk image is malformed

数据库损坏
解决方案
1. 重启微信（删除app/DataBase/Msg文件夹、退出登录再重新登录）

#### 6. sqlite3.OperationalError: no such table: ContactHeadImg1

    
![image.png](https://blog.lc044.love/static/img/a5dd90b7614ee0301e8c7a06d059bc48.image.webp)

### 2.2 数据导出遇到的问题

#### 导出PDF无响应卡死不动
    
导出PDF需要消耗电脑大量的CPU和内存资源，所以导出的时候不要一次选择太多数据
    
# 联系方式

如果您遇到了问题，可以添加QQ群寻求帮助，由于精力有限，不能回答所有问题，所以还请您仔细阅读文档之后再考虑是否入群

## 加群方式

关注官方公众号，回复：联系方式

后续更新将会在公众号同步发布

![](https://blog.lc044.love/static/img/3fd32f1732a2c8f53a7eb923472b8f19.clipboard-2023-12-18.webp)