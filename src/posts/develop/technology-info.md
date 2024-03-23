---
head:
  - - meta
    - name: keywords
      content: QChatGPT插件开发教程
title: 技术信息
icon: code
author: RockChinQ
date: 2023-09-30
category:
  - 技术信息
index: false
---
以下是QChatGPT实现原理等技术信息，贡献之前请仔细阅读

> 此文档为 QChatGPT 2.x 的技术文档，已过时，3.x 版本请直接查看源码。  
> 请先阅读OpenAI API的相关文档 https://beta.openai.com/docs/ ，以下信息假定您已了解OpenAI模型的相关特性及其接口的调用方法。

## 术语

包含OpenAI API涉及的术语和项目中的概念的命名  
括号中是程序中相应术语的命名，无括号的为抽象概念

### 模型(model)

AI模型，程序调用OpenAI的接口获取的内容均为OpenAI的模型生成的内容。

### 字符(tokens)

OpenAI定义的字符，ASCII字符为1 token，其他为2 token。

### 提示符(prompt)

i. 调用OpenAI的文字补全模型时的提示语，模型接口会根据提示语返回回复内容。程序底层会将对话内容进行封装生成提示符。调用文字补全模型时的提示符均由`user_name`(默认为`You`,可在配置文件修改)和`bot_name`(默认为`Bot`,可在配置文件修改)标记对话角色以供模型识别，以下是实例：

```
You:今天天气真不错
Bot:很高兴你喜欢今天的天气:)
You:谢谢你
Bot:不客气:)
```
补全模型调用的程序实现请查看下文`实现`节。  

ii. 调用OpenAI的绘图模型时的提示语，模型会根据提示语进行绘图并返回图片URL。

### 对象

程序将单个人或单个QQ群视为一个对象，对象和模型是一次会话中的对话双方。

### 会话(session)

会话只对文字补全功能有效，绘图功能无会话概念。每个对象使用同一个会话，会话中仅有对象和模型两个角色，故群内所有的人都将被视为同一个角色与模型进行对话。  

程序获取回复的本质是`文字补全`。
由于对话需要实现联系上下文，故程序会将模型与对象的对话历史记录作为`提示符`发送给OpenAI的接口以获取符合前文的回复。
而OpenAI的文字补全接口的提示符具有长度限制(默认使用的`text-davinci-003`限制为4096 tokens)，
所以增加`会话`概念以管理向接口发送的提示符内容。  

会话的存活时间可以在`config.py`中设置，默认为20分钟。会话过期之后会被存入数据库并重置。下一次该对象发起对话时将重启新的会话。

### 预设值、人格(default_prompt)

每个会话的预设对话信息，可在`config.py`中设置，程序会在每个会话创建时向提示符写入以下内容:

```
You:<预设信息>
Bot:好的
```

## 实现

### QQ机器人

> 程序路径:
> pkg.qqbot

- `pkg.qqbot.manager`中的`QQBotManager`实现了接收消息、调用OpenAI模块处理消息、报告审计模块记录使用量等功能，并提供通知管理员、发送消息等方法供其他模块调用。  
- `pkg.qqbot.filter`提供了敏感词过滤的相关操作。  
- `pkg.qqbot.process`提供了私聊消息和群聊消息的统一处理逻辑。  

使用mirai及YiriMirai作为Python与QQ交互的框架，详细请见其文档。  
在启动时会调用YiriMirai的函数以创建一个bot对象，用于程序通过mirai与QQ进行交互，在上层程序调用此bot对象的方法进行消息处理。    
由于YiriMirai暂时无法关闭机器人，故在热重载前后维持同一个bot对象，这意味着QQ机器人的相关配置(QQ号、适配器等)信息不支持热重载。

### 数据库

> 程序路径:
> pkg.database

- `pkg.database.manager`中的`DatabaseManager`封装了诸多调用数据库的方法以供其他模块调用。  

使用SQLite作为数据库，储存所有对象的历史会话信息、api-key的费用情况、api-key的使用量情况。  

### OpenAI交互

> 程序路径:
> pkg.openai

- `pkg.openai.manager`中的`OpenAIInteract`类封装了OpenAI的文字补全`Completion`API和绘图API供机器人模块调用，并在接口调用成功之后向审计模块报告当前使用的api-key的使用量信息。
- `pkg.openai.keymgr`实现了多api-key的管理，其中以`exceeded`变量在运行时记录api-key的超额报错记录，并提供根据超额记录进行的api-key切换功能。
- `pkg.openai.pricing`记录各个模型的费用信息，供调用接口时估算费用，费用估算功能不再与api-key的切换挂钩，api-key仅在调用接口报错超额时进行切换。
- `pkg.openai.session`中的`Session`进行会话管理。

### utils模块

#### context模块

保存前述模块中的对象，并允许各个模块从此处获取其他模块的对象以调用其方法。

#### 热重载功能
  
> pkg.utils.reloader

重载前保存context中的所有对象，执行`main.py`中的程序关闭流程，使用`importlib`的`reload`函数重载所有模块(包含配置文件，包含新增的模块)，重载后将context恢复，并执行程序启动流程。  
所有模块都会重新创建对象，但QQ机器人模块中的bot对象不会被重新创建，这是因为YiriMirai提供的shutdown方法无法使用，这意味着`config.py`中关于QQ机器人的配置不支持热重载。

#### 热更新功能

> pkg.utils.updater

使用`dulwich`库执行pull操作拉取远程仓库的最新源码，并进行一次热重载加载最新代码。