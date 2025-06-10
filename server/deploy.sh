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

# 停止现有服务
PM2=$(which pm2)
$PM2 delete 100wishplan 2>/dev/null || true

# 使用 ecosystem.config.cjs 启动服务
if [ -f "$SERVER_DIR/ecosystem.config.cjs" ]; then
    echo "Using ecosystem.config.cjs to start service..."
    $PM2 start ecosystem.config.cjs --env production
else
    echo "Error: ecosystem.config.cjs not found"
    exit 1
fi

# 验证服务是否正在运行
sleep 5
if ! $PM2 show 100wishplan > /dev/null 2>&1; then
    echo "Error: Failed to start the service"
    exit 1
fi

echo "Service started successfully"
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

# 复制ecosystem配置文件
if [ -f "./ecosystem.config.js" ]; then
    echo "复制ecosystem配置文件..."
    cp ecosystem.config.js "$SERVER_DIR/"
fi

# 启动新服务
echo "启动服务..."
echo "工作目录: $SERVER_DIR"
cd "$SERVER_DIR"

# 使用ecosystem配置启动服务
if [ -f "$SERVER_DIR/ecosystem.config.js" ]; then
    echo "使用ecosystem.config.js启动服务..."
    $PM2 start ecosystem.config.js --env production
else
    echo "使用默认配置启动服务..."
    $PM2 start "$SERVER_DIR/index.js" --name "100wishplan" --env production --cwd "$SERVER_DIR"
fi

# 验证服务状态
echo "验证服务状态..."
sleep 2
$PM2 show 100wishplan

# 检查服务是否成功启动
if $PM2 show 100wishplan | grep -q "online"; then
    echo "✓ 服务已成功启动"
    echo "检查API可用性..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health | grep -q "200"; then
        echo "✓ API健康检查通过"
    else
        echo "✗ API健康检查失败"
        echo "查看应用日志..."
        $PM2 logs 100wishplan --lines 20
    fi
else
    echo "✗ 服务启动失败"
    echo "查看错误日志..."
    $PM2 logs 100wishplan --lines 20
    exit 1
fi

# 保存 PM2 进程列表
echo "保存PM2配置..."
$PM2 save

# 设置开机自启动（如果还没设置）
if [ ! -f "/etc/systemd/system/pm2-root.service" ]; then
    echo "设置 PM2 开机自启动..."
    $PM2 startup
fi

echo "部署完成！"
