#!/bin/bash

# 设置工作目录
SERVER_DIR="/www/wwwroot/100wish.midikang.com/server"
BACKUP_DIR="/www/backup/100wish/$(date +%Y%m%d_%H%M%S)"

# 如果服务器目录已存在，创建备份
if [ -d "$SERVER_DIR" ]; then
    echo "创建当前版本备份..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$SERVER_DIR"/* "$BACKUP_DIR/"
fi

# 创建服务器目录
mkdir -p "$SERVER_DIR"
mkdir -p "$SERVER_DIR/data"

# 解压新文件到服务器目录
unzip -o server.zip -d "$SERVER_DIR"

# 如果有备份的数据库文件，恢复它
if [ -f "$BACKUP_DIR/data/database.sqlite" ]; then
    echo "恢复数据库文件..."
    cp "$BACKUP_DIR/data/database.sqlite" "$SERVER_DIR/data/"
fi

# 如果有备份的环境配置文件，恢复它
if [ -f "$BACKUP_DIR/.env" ]; then
    echo "恢复环境配置文件..."
    cp "$BACKUP_DIR/.env" "$SERVER_DIR/"
else
    echo "创建新的环境配置文件..."
    cp "$SERVER_DIR/.env.production" "$SERVER_DIR/.env"
fi

# 设置文件权限
chown -R www:www "$SERVER_DIR"
chmod -R 755 "$SERVER_DIR"
chmod -R 777 "$SERVER_DIR/data"

# 进入服务器目录
cd "$SERVER_DIR"

# 检查并安装 Node.js 依赖
echo "安装 Node.js 依赖..."
npm install --production

# 检查并安装 PM2
if ! command -v pm2 &> /dev/null; then
    echo "正在安装 PM2..."
    npm install -g pm2
fi

# 确保 PM2 已经成功安装
if ! command -v pm2 &> /dev/null; then
    echo "PM2 安装失败，尝试使用其他方法..."
    # 尝试使用完整路径
    if [ -f "/usr/local/bin/pm2" ]; then
        PM2="/usr/local/bin/pm2"
    elif [ -f "/usr/bin/pm2" ]; then
        PM2="/usr/bin/pm2"
    elif [ -f "$HOME/.npm-global/bin/pm2" ]; then
        PM2="$HOME/.npm-global/bin/pm2"
    else
        echo "无法找到 PM2，请手动安装："
        echo "npm install -g pm2"
        exit 1
    fi
else
    PM2="pm2"
fi

# 停止旧的进程（如果存在）
$PM2 delete 100wishplan 2>/dev/null || true

# 启动新服务
echo "启动服务..."
$PM2 start index.js --name "100wishplan" --env production

# 保存 PM2 进程列表
$PM2 save

# 设置开机自启动（如果还没设置）
if [ ! -f "/etc/systemd/system/pm2-root.service" ]; then
    echo "设置 PM2 开机自启动..."
    $PM2 startup
fi

echo "部署完成！"
