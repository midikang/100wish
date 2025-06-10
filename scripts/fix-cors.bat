@echo off
chcp 65001 >nul
color 0A
echo === 100wishplan CORS 修复部署脚本 ===
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

echo 3. 在服务器上执行部署脚本...
ssh %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH% && chmod +x deploy.sh && ./deploy.sh"

echo 4. 验证API健康状态...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://100wish.midikang.com/api/health' -UseBasicParsing; if($response.StatusCode -eq 200) { Write-Host '✅ API 服务正常运行' -ForegroundColor Green } else { Write-Host '❌ API 服务异常' -ForegroundColor Red } } catch { Write-Host '❌ API 服务无法访问: ' $_.Exception.Message -ForegroundColor Red }"

echo.
echo === 部署完成！ ===
echo 请打开浏览器验证同步功能是否正常工作
