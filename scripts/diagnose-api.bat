@echo off
chcp 65001 >nul
color 0A
echo === 100wishplan API 诊断工具 ===
echo.

echo 1. 打包服务器文件...
powershell -ExecutionPolicy Bypass -File scripts\package-server.ps1

echo 2. 上传文件到服务器...
:: 这里需要填写你的服务器信息
set /p SERVER_USER="输入服务器用户名: "
set /p SERVER_IP="输入服务器IP地址: "
set SERVER_PATH=/www/wwwroot/100wish.midikang.com

:: 使用SCP上传文件（需要已安装OpenSSH）
echo 正在上传服务器文件...
scp "deploy\server.zip" %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/
scp "scripts\api-diagnostics.cjs" %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/api-diagnostics.cjs

echo 3. 在服务器上执行部署脚本...
ssh %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH% && chmod +x deploy.sh && ./deploy.sh"

echo 4. 运行 API 诊断工具...
ssh %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH% && node api-diagnostics.cjs"

echo.
echo === 诊断完成！ ===
echo 请检查上面的输出以排查问题
