@echo off
chcp 65001 >nul
color 0A
echo === 100wishplan 自动部署脚本 ===
echo.

echo 1. 打包服务器文件...
powershell -ExecutionPolicy Bypass -File scripts\package-server.ps1

echo 2. 打包前端文件...
powershell -Command "Compress-Archive -Path .\deploy\assets\*,.\deploy\index.html,.\deploy\vite.svg -DestinationPath .\deploy\front.zip -Force"

@REM echo 3. 上传文件到服务器...
@REM :: 这里需要配置你的服务器信息
@REM set SERVER_USER=你的用户名
@REM set SERVER_IP=你的服务器IP
@REM set SERVER_PATH=/www/wwwroot/100wish.midikang.com

@REM :: 使用PSCP上传文件（需要先安装PuTTY）
@REM echo 正在上传服务器文件...
@REM pscp -i your-key.ppk .\deploy\server.zip %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/

@REM echo 正在上传前端文件...
@REM pscp -i your-key.ppk .\deploy\front.zip %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/

@REM echo 4. 在服务器上执行部署脚本...
@REM plink -i your-key.ppk %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH% && unzip -o front.zip -d ./ && chmod +x deploy.sh && ./deploy.sh"

echo.
echo === 部署完成！ ===
echo 请访问 http://100wish.midikang.com 验证部署结果
