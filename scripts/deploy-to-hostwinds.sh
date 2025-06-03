# 100wishplan 自动部署脚本
# 使用前请先配置服务器信息

# 服务器配置
SERVER_USER="你的用户名"
SERVER_IP="你的服务器IP"
SERVER_PATH="/www/wwwroot/100wish.midikang.com"
SSH_KEY="$HOME/.ssh/id_rsa"  # 配置你的SSH密钥路径

echo "=== 100wishplan 自动部署脚本 ==="
echo ""

# 1. 打包服务器文件
echo "1. 打包服务器文件..."
pwsh -Command "./scripts/package-server.ps1"

# 2. 打包前端文件
echo "2. 打包前端文件..."
pwsh -Command "Compress-Archive -Path ./deploy/assets/*,./deploy/index.html,./deploy/vite.svg -DestinationPath ./deploy/front.zip -Force"

# 3. 上传文件到服务器
echo "3. 上传文件到服务器..."
echo "正在上传服务器文件..."
scp -i "$SSH_KEY" ./deploy/server.zip "$SERVER_USER@$SERVER_IP:$SERVER_PATH/"

echo "正在上传前端文件..."
scp -i "$SSH_KEY" ./deploy/front.zip "$SERVER_USER@$SERVER_IP:$SERVER_PATH/"

# 4. 在服务器上执行部署脚本
echo "4. 在服务器上执行部署脚本..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "cd $SERVER_PATH && unzip -o front.zip -d ./ && chmod +x deploy.sh && ./deploy.sh"

echo ""
echo "=== 部署完成！ ==="
echo "请访问 http://100wish.midikang.com 验证部署结果"
