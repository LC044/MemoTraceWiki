# 大模型训练指南2(GLM-4-9B)

# GLM-4-9B Chat 对话模型微调

本 demo 中，你将体验到如何微调 GLM-4-9B-Chat 对话开源模型(不支持视觉理解模型)。 请严格按照文档的步骤进行操作，以避免不必要的错误。

有问题请参考[官方文档](https://github.com/THUDM/GLM-4)，本文档只是我自己的测试结果。

## 一、硬件检查

**本文档的数据均在以下硬件环境测试,实际运行环境需求和运行占用的显存略有不同，请以实际运行环境为准。微调的资源占用均按照
configs 文件夹中的配置文件设置**

实际测试硬件信息：
+ OS: Ubuntu 22.04
+ Memory: 64GB
+ Python: 3.11.9
+ CUDA Version:  12.4
+ GPU Driver: 550.76.01 
+ GPU: NVIDIA 4090 24GB * 1

| 微调模型         | 微调方案               | 显存占用                    | 权重保存点大小   | 
|-----------------|-----------------------|----------------------------|-----------|
| GLM-4-9B-Chat   | lora (PEFT)           | 22G                        | 17M       |

```
官方测试硬件信息:
+ OS: Ubuntu 22.04
+ Memory: 512GB
+ Python: 3.10.12 / 3.12.3 (如果您使用 Python 3.12.3 目前需要使用 git 源码安装 nltk)
+ CUDA Version:  12.3
+ GPU Driver: 535.104.05
+ GPU: NVIDIA A100-SXM4-80GB * 8
```

在开始微调之前，请你先安装 `basic_demo` 中的依赖，并保证克隆了最新版本的模型仓库，同时您需要安装本目录下的依赖项：

```bash
pip install -r requirements.txt
```

## 二、多轮对话格式

多轮对话微调示例采用 GLM-4 对话格式约定，对不同角色添加不同 `loss_mask` 从而在一遍计算中为多轮回复计算 `loss`。

对于数据文件，样例采用如下格式

如果您仅希望微调模型的对话能力，而非工具能力，您应该按照以下格式整理数据。

这里是一个不带有工具的例子（MemoTrace导出JSON设置里选择GLM4模型）:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "类型#裤*材质#牛仔布*风格#性感"
    },
    {
      "role": "assistant",
      "content": "3x1的这款牛仔裤采用浅白的牛仔面料为裤身材质，其柔然的手感和细腻的质地，在穿着舒适的同时，透露着清纯甜美的个性气质。除此之外，流畅的裤身剪裁将性感的腿部曲线彰显的淋漓尽致，不失为一款随性出街的必备单品。"
    }
  ]
}
```

- `system` 角色为可选角色，但若存在 `system` 角色，其必须出现在 `user`
  角色之前，且一个完整的对话数据（无论单轮或者多轮对话）只能出现一次 `system` 角色。
- `tools` 字段为可选字段，若存在 `tools` 字段，其必须出现在 `system`
  角色之后，且一个完整的对话数据（无论单轮或者多轮对话）只能出现一次 `tools` 字段。当 `tools` 字段存在时，`system`
  角色必须存在并且 `content` 字段为空。

## 三、配置文件

微调配置文件位于 `config` 目录下，包括以下文件：

1. `ds_zereo_2 / ds_zereo_3.json`: deepspeed 配置文件。
2. `lora.yaml / ptuning_v2
3. .yaml / sft.yaml`: 模型不同方式的配置文件，包括模型参数、优化器参数、训练参数等。 部分重要参数解释如下：
    + data_config 部分
        + train_file: 训练数据集的文件路径。
        + val_file: 验证数据集的文件路径。
        + test_file: 测试数据集的文件路径。
        + num_proc: 在加载数据时使用的进程数量。
    + max_input_length: 输入序列的最大长度。
    + max_output_length: 输出序列的最大长度。
    + training_args 部分
        + output_dir: 用于保存模型和其他输出的目录。
        + max_steps: 训练的最大步数。
        + per_device_train_batch_size: 每个设备（如 GPU）的训练批次大小。
        + dataloader_num_workers: 加载数据时使用的工作线程数量。
        + remove_unused_columns: 是否移除数据中未使用的列。
        + save_strategy: 模型保存策略（例如，每隔多少步保存一次）。
        + save_steps: 每隔多少步保存一次模型。
        + log_level: 日志级别（如 info）。
        + logging_strategy: 日志记录策略。
        + logging_steps: 每隔多少步记录一次日志。
        + per_device_eval_batch_size: 每个设备的评估批次大小。
        + evaluation_strategy: 评估策略（例如，每隔多少步进行一次评估）。
        + eval_steps: 每隔多少步进行一次评估。
        + predict_with_generate: 是否使用生成模式进行预测。
    + generation_config 部分
        + max_new_tokens: 生成的最大新 token 数量。
    + peft_config 部分
        + peft_type: 使用的参数有效调整类型 (支持 LORA 和 PREFIX_TUNING)。
        + task_type: 任务类型，这里是因果语言模型 (不要改动)。
    + Lora 参数：
        + r: LoRA 的秩。
        + lora_alpha: LoRA 的缩放因子。
        + lora_dropout: 在 LoRA 层使用的 dropout 概率。
    + P-TuningV2 参数：
        + num_virtual_tokens: 虚拟 token 的数量。
        + num_attention_heads: 2: P-TuningV2 的注意力头数(不要改动)。
        + token_dim: 256: P-TuningV2 的 token 维度(不要改动)。

使用的配置文件（注意修改数据集文件后缀名）
```yaml
data_config:
  train_file: train.jsonl
  val_file: dev.jsonl
  test_file: dev.jsonl
  num_proc: 10
max_input_length: 512
max_output_length: 128
training_args:
  # see `transformers.Seq2SeqTrainingArguments`
  output_dir: ./output
  max_steps: 120000
  # needed to be fit for the dataset
  learning_rate: 5e-4
  # settings for data loading
  per_device_train_batch_size: 1
  dataloader_num_workers: 16
  remove_unused_columns: false
  # settings for saving checkpoints
  save_strategy: steps
  save_steps: 2000
  # settings for logging
  log_level: info
  logging_strategy: steps
  logging_steps: 100
  # settings for evaluation
  per_device_eval_batch_size: 1
  evaluation_strategy: steps
  eval_steps: 5200000 # 验证的时候会报错，所以我直接设置很大，不让进行验证
  # settings for optimizer
  # adam_epsilon: 1e-6
  # uncomment the following line to detect nan or inf values
  # debug: underflow_overflow
  predict_with_generate: false
  # see `transformers.GenerationConfig`
  generation_config:
    max_new_tokens: 512
  # set your absolute deepspeed path here
  # deepspeed: configs/ds_zero_3.json
peft_config:
  peft_type: LORA
  task_type: CAUSAL_LM
  r: 8
  lora_alpha: 32
  lora_dropout: 0.2
  target_modules: ["query_key_value"]
```

## 四、开始微调

通过以下代码执行 **单机多卡/多机多卡** 运行，这是使用 `deepspeed` 作为加速方案的，您需要安装 `deepspeed`。接着，按照此命令运行：

```shell
OMP_NUM_THREADS=1 torchrun --standalone --nnodes=1 --nproc_per_node=8  finetune.py  data/AdvertiseGen/  THUDM/glm-4-9b-chat  configs/lora.yaml # For Chat Fine-tune
OMP_NUM_THREADS=1 torchrun --standalone --nnodes=1 --nproc_per_node=8  finetune_vision.py  data/CogVLM-311K/  THUDM/glm-4v-9b  configs/lora.yaml  # For VQA Fine-tune
```

通过以下代码执行 **单机单卡** 运行。

```shell
python finetune.py  data/AdvertiseGen/  THUDM/glm-4-9b-chat  configs/lora.yaml # For Chat Fine-tune
python finetune_vision.py  data/CogVLM-311K/  THUDM/glm-4v-9b configs/lora.yaml # For VQA Fine-tune
```

## 五、从保存点进行微调

如果按照上述方式进行训练，每次微调都会从头开始，如果你想从训练一半的模型开始微调，你可以加入第四个参数，这个参数有两种传入方式:

1. `yes`, 自动从最后一个保存的 Checkpoint开始训练
2. `XX`, 断点号数字 例 `600` 则从序号600 Checkpoint开始训练

例如，这就是一个从最后一个保存点继续微调的示例代码

```shell
python finetune.py  data/AdvertiseGen/  THUDM/glm-4-9b-chat  configs/lora.yaml yes
```

## 六、使用微调后的模型

### 6.1 在 inference.py 中验证微调后的模型

您可以在 `finetune_demo/inference.py` 中使用我们的微调后的模型，仅需要一行代码就能简单的进行测试。

```shell
python inference.py your_finetune_path
```

这样，得到的回答就微调后的回答了。

### 6.2 在本仓库的其他 demo 或者外部仓库使用微调后的模型

您可以在任何一个 demo 内使用我们的 `LORA` 和 全参微调的模型。这需要你自己按照以下教程进行修改代码。

1. 使用`finetune_demo/inference.py`中读入模型的方式替换 demo 中读入模型的方式。

> 请注意，对于 LORA 和 P-TuningV2 我们没有合并训练后的模型，而是在`adapter_config.json`
> 中记录了微调型的路径，如果你的原始模型位置发生更改，则你应该修改`adapter_config.json`中`base_model_name_or_path`的路径。

```python
def load_model_and_tokenizer(
        model_dir: Union[str, Path], trust_remote_code: bool = True
) -> tuple[ModelType, TokenizerType]:
    model_dir = _resolve_path(model_dir)
    if (model_dir / 'adapter_config.json').exists():
        model = AutoPeftModelForCausalLM.from_pretrained(
            model_dir, trust_remote_code=trust_remote_code, device_map='auto'
        )
        tokenizer_dir = model.peft_config['default'].base_model_name_or_path
    else:
        model = AutoModelForCausalLM.from_pretrained(
            model_dir, trust_remote_code=trust_remote_code, device_map='auto'
        )
        tokenizer_dir = model_dir
    tokenizer = AutoTokenizer.from_pretrained(
        tokenizer_dir, trust_remote_code=trust_remote_code
    )
    return model, tokenizer
```

2. 读取微调的模型，请注意，你应该使用微调模型的位置，例如，若你的模型位置为`/path/to/finetune_adapter_model`
   ，原始模型地址为`path/to/base_model`,则你应该使用`/path/to/finetune_adapter_model`作为`model_dir`。
3. 完成上述操作后，就能正常使用微调的模型了，其他的调用方式没有变化。

## 七、部署OpenAI格式的api接口

### 7.1 合并微调模型

由于GLM4官方给出的api接口只有vLLM部署的方式，而vLLM是不支持直接加载微调模型的，所以需要将微调模型跟原始大模型进行合并生成新的模型。可以使用以下代码进行合并：

```python
import argparse

import torch
from peft import PeftModel, PeftConfig
from transformers import (
    AutoModel,
    AutoTokenizer,
    BloomForCausalLM,
    BloomTokenizerFast,
    AutoModelForCausalLM,
    LlamaTokenizer,
    LlamaForCausalLM,
    AutoModelForSequenceClassification,
)

MODEL_CLASSES = {
    "bloom": (BloomForCausalLM, BloomTokenizerFast),
    "chatglm": (AutoModel, AutoTokenizer),
    "llama": (LlamaForCausalLM, LlamaTokenizer),
    "baichuan": (AutoModelForCausalLM, AutoTokenizer),
    "auto": (AutoModelForCausalLM, AutoTokenizer),
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model_type', default="chatglm", type=str, required=False)
    parser.add_argument('--tokenizer_path', default=None, type=str,
                        help="Please specify tokenization path.")

    parser.add_argument('--output_dir', default='/home/msi4090/GLM-4/merged3', type=str)
    parser.add_argument('--base_model_path', type=str, required=True)
    parser.add_argument('--lora_model_path', type=str, required=True)
    args = parser.parse_args()

    base_model_path = args.base_model_path
    lora_model_path = args.lora_model_path
    output_dir = args.output_dir
    peft_config = PeftConfig.from_pretrained(lora_model_path)
    model_class, tokenizer_class = MODEL_CLASSES[args.model_type]

    # 模型加载
    if peft_config.task_type == "SEQ_CLS":
        if args.model_type == "chatglm":
            raise ValueError("chatglm does not support sequence classification")
        base_model = AutoModelForSequenceClassification.from_pretrained(
            base_model_path,
            num_labels=1,
            load_in_8bit=False,
            torch_dtype=torch.float32,
            trust_remote_code=True,
            device_map="auto",
        )
    else:
        base_model = model_class.from_pretrained(
            base_model_path,
            load_in_8bit=False,
            torch_dtype=torch.float16,
            trust_remote_code=True,
            device_map="auto",
        )

    # 分词器加载
    if args.tokenizer_path:
        tokenizer = tokenizer_class.from_pretrained(args.tokenizer_path, trust_remote_code=True)
    else:
        tokenizer = tokenizer_class.from_pretrained(base_model_path, trust_remote_code=True)

    # 修改词表大小
    # if args.resize_emb:
    #     base_model_token_size = base_model.get_input_embeddings().weight.size(0)
    #     if base_model_token_size != len(tokenizer):
    #         base_model.resize_token_embeddings(len(tokenizer))

    # 初始化Peft新模型
    new_model = PeftModel.from_pretrained(
        base_model,
        lora_model_path,
        device_map="auto",
        torch_dtype=torch.float16,
    )
    new_model.eval()
    new_base_model = new_model.merge_and_unload()

    tokenizer.save_pretrained(output_dir)
    new_base_model.save_pretrained(output_dir, safe_serialization=False, max_shard_size='10GB')


if __name__ == '__main__':
    main()
```

运行
```shell
python merge.py --model_type chatglm --output_dir ./merged --base_model_path ./glm4-9b --lora_model_path ./output/checkpoint-20000
```

### 7.2 部署api_server

把官方的openai_api_server.py中的`MODEL_PATH`修改为上面的合并输出文件夹即可。

运行
```shell
python openai_api_server.py
```

## 八、调用

现在你可以用任何一个支持OpenAI接口的应用程序调用你部署的api接口。

调用示例：

```python
from openai import OpenAI

base_url = "http://127.0.0.1:8002/v1/"
client = OpenAI(api_key="EMPTY", base_url=base_url)


def simple_chat(use_stream=False):
    messages = [
        {
            "role": "system",
            "content": "请在你输出的时候都带上“喵喵喵”三个字，放在开头。",
        },
        {
            "role": "user",
            "content": "你是谁"
        }
    ]
    response = client.chat.completions.create(
        model="chatglm3-6b",
        messages=messages,
        stream=use_stream,
        max_tokens=256,
        temperature=0.4,
        presence_penalty=1.2,
        top_p=0.8,
    )
    if response:
        if use_stream:
            for chunk in response:
                print(chunk)
        else:
            print(response)
    else:
        print("Error:", response.status_code)


if __name__ == "__main__":
    simple_chat(use_stream=False)
```