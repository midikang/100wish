#!/bin/bash

# 安装 Node.js 和 PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install pm2 -g

# 创建应用目录
mkdir -p /www/wwwroot/100wishplan
cd /www/wwwroot/100wishplan

# 拉取代码（需要替换为实际的仓库地址）
# git clone <your-repository-url> .

# 安装依赖
npm install

# 构建前端
npm run build

# 启动后端服务
pm2 start ecosystem.config.js
