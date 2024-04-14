import requests
import json

url = 'http://127.0.0.1:7861/knowledge_base/recreate_vector_store'
headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
}
data = {
    "knowledge_base_name": "MemoTrace",
    "allow_empty_kb": True,
    "vs_type": "faiss",
    "embed_model": "bge-large-zh-v1.5",
    "chunk_size": 250,
    "chunk_overlap": 50,
    "zh_title_enhance": False,
    "not_refresh_vs_cache": False
}

response = requests.post(url, headers=headers, json=data, stream=True)

for line in response.iter_lines():
    if line:
        # 解析每行数据，并打印
        decoded_line = line.decode('utf-8').strip('data: ')
        print(decoded_line)
        # print(json.loads(decoded_line))
