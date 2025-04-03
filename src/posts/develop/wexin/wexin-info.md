# 一、💡 引言

# 二、✨ 功能特点

# 三、⛏️ 技术方案

## 3.1 微信聊天记录的存储结构（SQLite数据库）

### 3.1.1 微信3

微信3数据库目录结构

```text
├─Msg
│  │  Applet.db             # 小程序
│  │  BizChat.db            # 
│  │  BizChatMsg.db
│  │  ChatMsg.db
│  │  ChatRoomUser.db
│  │  ClientGeneral.db
│  │  CustomerService.db
│  │  Emotion.db            # 表情包
│  │  Favorite.db           # 微信收藏
│  │  FTSContact.db         # 搜索联系人
│  │  FTSFavorite.db        # 搜索收藏
│  │  FunctionMsg.db
│  │  HardLinkFile.db       # 微信文件
│  │  HardLinkImage.db      # 微信图片
│  │  HardLinkVideo.db      # 微信视频
│  │  ImageTranslate.db
│  │  LinkHistory.db
│  │  MicroMsg.db           # 微信联系人
│  │  Misc.db               # 微信联系人头像
│  │  MultiSearchChatMsg.db
│  │  NewTips.db
│  │  OpenIMContact.db      # 企业微信联系人
│  │  OpenIMMedia.db        # 企业微信语音
│  │  OpenIMMsg.db          # 企业微信聊天记录
│  │  OpenIMResource.db     # 企业微信联系人公司信息
│  │  PreDownload.db        
│  │  PublicMsg.db          # 公众号消息
│  │  PublicMsgMedia.db     # 公众号语音消息
│  │  Sns.db                # 朋友圈数据
│  │  StoreEmotion.db
│  │  SyncMsg.db
│  │  Voip.db
│  │  
│  └─Multi                  # Multi文件夹里的数据库采用了分库操作，将一个大数据库分成多个便于提高检索效率
│          FTSMSG0.db       # 搜索聊天记录
│          FTSMSG1.db
│          MediaMSG0.db     # 语音消息 0
│          MediaMSG1.db     # 语音消息 1
│          MSG0.db          # 聊天记录 0
│          MSG1.db          # 聊天记录 1
```

### 3.1.2 微信4

微信4数据库目录结构

```text
├─db_storage
│  │  
│  ├─biz
│  │      biz.db                
│  │      
│  ├─contact                    # 联系人
│  │      contact.db
│  │      contact_fts.db
│  │      fmessage_new.db
│  │      wa_contact_new.db
│  │      
│  ├─emoticon                   # 表情包
│  │      emoticon.db
│  │      
│  ├─favorite                   # 微信收藏
│  │      favorite.db
│  │      favorite_fts.db
│  │      
│  ├─hardlink                   # 微信图片、视频、文件
│  │      hardlink.db
│  │      
│  ├─head_image                 # 微信头像
│  │      head_image.db
│  │      
│  ├─ilinkvoip
│  │      ilinkvoip.db
│  │      
│  ├─message                    # 聊天记录
│  │      biz_message_0.db      # 公众号消息
│  │      media_0.db            # 语音消息
│  │      message_0.db          # 聊天记录
│  │      message_1.db
│  │      message_fts.db
│  │      message_resource.db
│  │      message_revoke.db
│  │      
│  ├─newtips
│  │      newtips.db
│  │      
│  ├─session                    # 聊天会话窗口
│  │      session.db
│  │      
│  ├─sns                        # 朋友圈
│  │      sns.db
│  │      
│  ├─teenager
│  │      teenager.db
│  │      
│  ├─tencentpay
│  │      tencentpay.db
│  │      
│  ├─wcfinder
│  │      wcfinder.db
│  │      
│  └─websearch
│          websearch.db
```

### 3.1.3 数据库结构说明

不管是微信3还是微信4，聊天数据、图片、视频、文件、表情包、语音都是存储在不同的数据库中的，因此解析一条聊天记录要综合查询多个数据库的内容。

为了避免跨数据库连接操作，MemoTrace为每个数据库都建立一个连接，各数据库之间互相不产生依赖，由上层模块综合调用各个数据库，组装出每一条完整的数据。

微信3和微信4的数据库不尽相同，部分数据库字段有很大调整，所以MemoTrace把v3和v4分成独立的两个部分，把v3和v4的聊天记录(Message)和联系人(Contact)抽象得出相同的一个数据结构，通过ManagerV3和ManagerV4实现不同数据库模块的分布管理和扩展，通过DataBaseInterface层对外提供统一接口，隔离内部实现。

详细设计将在后面给出。


![image.png](https://blog.lc044.love/static/img/0fbb4eafa332f2a77d912ffa9c72f0bd.image.webp)

## 3.2 微信部分数据解析

### 3.2.1 微信图片说明

#### 微信3

> 微信4.0之前的图片都采用了最简单的异或加密，即采用一个异或密钥（一个0-255的整数）与图片文件的每个字节进行异或运算。由于异或运算具有可逆性，采用相同的密钥再做一次异或运算即可得到原始图片文件。

**异或运算性质**

1. 交换律： A ^ B = B ^ A
2. 结合律： ( A ^ B ) ^ C = A ^ ( B ^ C )
3. 自反性： A ^ B ^ B = A

假设：

- 加密后数据：`C`
- 已知的原始文件头（Magic Number）：`P`
- 密钥：`K`
- 密钥长度：`L`
- 第 `i` 个字节：`i`

不同格式的图片通常有固定的文件头，例如：

- **PNG**: `89 50 4E 47 0D 0A 1A 0A`
- **JPG**: `FF D8 FF E0` 或 `FF D8 FF DB`
- **BMP**: `42 4D`
- **GIF**: `47 49 46 38 39 61` 或 `47 49 46 38 37 61` 

根据异或运算的性质：

$$
C_i = P_i \oplus K_{i}
$$

可得：

$$
K_{i} = C_i \oplus P_i
$$

所以，我们可以通过已知的加密数据 `C` 和已知的文件头 `P` 计算密钥的前 `L` 个字节：

$$
K_0 = C_0 \oplus P_0
$$

$$
K_1 = C_1 \oplus P_1
$$

$$
...
$$

$$
K_{L-1} = C_{L-1} \oplus P_{L-1}
$$

密钥是一个0-255范围内的整数所以: $key = K_{0} = K_{1} = K_{2} ··· = K_{L-1}$

#### 微信4

> 微信4的图片采用AES-EBC和异或混合加密方式。

**.dat文件头(15个字节)**

| 大小(字节) | 内容/类型      | 说明              |
| ------ | ---------- | --------------- |
| 6      | 0x07085631 | .dat文件标识符       |
| 4      | int （小端序）  | AES-EBC128 加密长度 |
| 4      | int （小端序）  | 异或加密长度          |
| 1      | 0x01       | 未知              |


![image.png](https://blog.lc044.love/static/img/a049d886cbd0e95ca2018ac91843a966.image.webp)

**文件末尾采用异或加密，加密长度最大为1MB，多余部分未加密。**

> 例如：一个文件小于1kB，则全部是AES加密，如果大于1kB且小于1MB（实际是1MB零1KB），则前1KB部分采用AES加密，剩余部分采用异或加密。如果文件大于1MB，则前1KB采用AES加密，后面1MB采用异或加密，中间部分未加密。


![image.png](https://blog.lc044.love/static/img/403cd0087b1a728b2e73314c414f5a0f.image.webp)

- AES 密钥为：`0xcfcd208495d565ef`
- 根据异或运算的可逆性，结合jpg文件末尾的 **FF D9** 两个字节，可以找一张微信生成的缩略图（一般为_t.dat结尾），两次异或运算即可得到异或密钥。

### 3.2.2 微信文件、文件夹命名

#### 微信3

```text
├─Applet
├─Backup
├─FileStorage       # 存储微信图片、视频、文件
│  ├─Cache          # 缩略图缓存
│  ├─CustomEmotion  # 表情包
│  ├─Fav            # 收藏
│  ├─File           # 微信文件
│  ├─MsgAttach      # 微信里与每个人的聊天数据
│  │  └─aefd036248e0d4d0f07900a6239272e4    # 该联系人wxid的md5加密
│  │      ├─Image                           # 聊天图片
│  │      │  └─2024-10
│  │      ├─Thumb                           # 聊天中产生的缩略图
│  │      │  └─2024-10
│  │      ├─File                            # 合并转发的聊天记录里的文件
│  │      │  └─2024-10
│  │      └─Video                           # 合并转发的聊天记录里的视频
│  │          └─2024-10
│  ├─Sns            # 朋友圈数据
│  ├─Video          # 聊天视频
│  │  └─2025-02
│  └─XEditor
├─Msg               # 聊天记录数据库
└─ResUpdateV2
```

#### 微信4

```text
├─business
├─cache             # 缓存
├─config            # 配置文件
├─db_storage        # 聊天记录数据库
├─msg               # 与好友的聊天数据
│  ├─attach         # 微信里与每个人的聊天数据
│  │  └─aefd036248e0d4d0f07900a6239272e4    # 该联系人wxid的md5加密
│  │  │  ├─2022-01                          # 日期
│  │  │  │  ├─Img                           # 聊天图片
│  │  │  │  └─Rec                           # 合并转发的聊天记录数据
│  │  │  │      └─2090_136022
│  │  │  │          └─Img
│  ├─file           # 微信文件
│  └─video          # 微信视频
├─Msg               # 聊天记录数据库
└─temp
```

微信4的文件命名方式跟之前有些微区别，但其数据存放是类似的（文件、视频单独存放在独立的文件夹中，图片按联系人分组存放到不同的文件夹中）

## 3.3 技术选型（Python、SQLite、protobuf解析等）

## 3.4 主要依赖库

# 四、🔭 系统架构设计

# 五、🔎 详细设计