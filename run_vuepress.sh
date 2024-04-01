
PORT=8080
# # uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# 获取当前日期，格式为YYYYMMDD
current_date=$(date +"%Y%m%d")
# 检查端口是否被占用
while lsof -i :$PORT; do
    echo "Port $PORT is already in use. Killing the process..."
    
    # 获取占用端口的进程ID并杀死
    pid=$(lsof -t -i :$PORT)
    kill -9 $pid
    
    # 等待一段时间，确保进程被杀死
    sleep 2
done

nohup pnpm docs:dev --port 8080 &

