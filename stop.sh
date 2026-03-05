#!/usr/bin/env bash

# Door Mates 停止脚本

PID_FILE=".server.pid"

echo "====================================="
echo "        Door Mates 停止脚本"
echo "====================================="

if [ -f "$PID_FILE" ]; then
    TARGET_PID=$(cat "$PID_FILE")
    
    # 检查进程是否存在
    if ps -p $TARGET_PID > /dev/null; then
        echo "⏳ 正在停止服务器 (PID: $TARGET_PID)..."
        kill $TARGET_PID
        
        # 等待一会以确保进程完全退出
        sleep 1
        
        if ps -p $TARGET_PID > /dev/null; then
            echo "⚠️ 进程未完全停止，尝试强制杀死..."
            kill -9 $TARGET_PID
        fi
        
        echo "✅ 服务已停止!"
    else
        echo "ℹ️ 服务似乎并未运行 (PID $TARGET_PID 不存在)。"
    fi
    
    # 无论如何，清理 PID 文件
    rm "$PID_FILE"
    echo "🧹 已清理 PID 文件"
else
    # 万一 PID 面板找不到，但服务仍在端口上
    echo "ℹ️ 未发现 PID 文件。尝试通过端口(8000)查找并终止进程..."
    if command -v lsof >/dev/null; then
        DEV_PIDS=$(lsof -t -i:8000)
        if [ ! -z "$DEV_PIDS" ]; then
             echo "检测到运行在 8000 端口的进程，正在终止..."
             kill $DEV_PIDS
             echo "✅ 进程已强制终止!"
        else
             echo "✅未发现运行的服务。"
        fi
    fi
fi
echo "====================================="
