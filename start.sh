#!/usr/bin/env bash

# Door Mates 启动脚本

PORT=8000
PID_FILE=".server.pid"

echo "====================================="
echo "        Door Mates 启动脚本"
echo "====================================="

# 启动前自动调用 stop.sh 停止旧进程
echo "🔄 尝试自动停止旧进程..."
./stop.sh

# 检查端口是否被占用 (如果系统有 lsof)
if command -v lsof >/dev/null 2>&1; then
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
        echo "❗️ 错误: 端口 $PORT 依然被占用。尝试强制终止失败，请手动检查。"
        exit 1
    fi
fi

echo "🚀 正在启动服务器..."
# 使用 nohup 后台运行
nohup node server.js > server.log 2>&1 &
NEW_PID=$!

# 保存 PID
echo $NEW_PID > "$PID_FILE"

echo "✅ 服务已成功在后台启动! (PID: $NEW_PID)"
echo "📄 日志输出在 server.log 文件中"
echo "🌐 访问地址: http://localhost:$PORT"
echo "====================================="
