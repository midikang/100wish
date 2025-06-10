@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
color 0A
echo ===== 100wishplan 前后端一键部署脚本 =====
echo.
set ROOT_DIR=d:\Lab\2025\100wishplan
set DEPLOY_DIR=%ROOT_DIR%\deploy

REM 确保部署目录存在
if not exist "%DEPLOY_DIR%" (
  mkdir "%DEPLOY_DIR%"
  echo 创建部署目录: %DEPLOY_DIR%
)

echo 1. 构建全新版本...
powershell -Command "cd '%ROOT_DIR%'; npm run build:minor"
if %ERRORLEVEL% neq 0 (
  echo ❌ 构建失败，请检查错误信息
  pause
  exit /b 1
)

echo 2. 打包服务器文件...
cd /d "%ROOT_DIR%"
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\package-server.ps1"
if %ERRORLEVEL% neq 0 (
  echo [错误] 打包服务器文件失败，请检查错误信息
  pause
  exit /b 1
)
cd /d "%ROOT_DIR%"

echo 3. 打包前端文件...
if exist "%DEPLOY_DIR%\assets" (
  cd /d "%ROOT_DIR%"
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path .\deploy\assets\*,.\deploy\index.html,.\deploy\vite.svg -DestinationPath .\deploy\front.zip -Force"
  if %ERRORLEVEL% neq 0 (
    echo [错误] 打包前端文件失败，请检查错误信息
    pause
    exit /b 1
  )
) else (
  echo [错误] 前端构建目录不存在: "%DEPLOY_DIR%\assets"
  echo 请先运行前端构建命令
  pause
  exit /b 1
)

echo 4. 上传文件到服务器...
echo.
set /p SERVER_USER="输入服务器用户名: "
set /p SERVER_IP="输入服务器IP地址: "
set SERVER_PATH=/www/wwwroot/100wish.midikang.com

echo.
echo 正在上传服务器文件...
scp "d:\Lab\2025\100wishplan\deploy\server.zip" %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/

echo 正在上传前端文件...
scp "d:\Lab\2025\100wishplan\deploy\front.zip" %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/

echo 正在上传诊断脚本...
scp "d:\Lab\2025\100wishplan\scripts\api-diagnostics.cjs" %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/api-diagnostics.cjs

echo 5. 在服务器上执行部署脚本...
ssh %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH% && unzip -o front.zip -d ./ && chmod +x deploy.sh && ./deploy.sh"

echo 6. 运行 API 诊断工具...
ssh %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH% && node api-diagnostics.cjs"

echo 7. 验证 API 可用性...
powershell -NoProfile -ExecutionPolicy Bypass -File "%ROOT_DIR%\scripts\verify-api.ps1"

echo.

echo.
echo ===== 部署完成！ =====
echo.
echo 请在浏览器中访问: https://100wish.midikang.com 
echo 验证同步功能是否正常工作

REM 显示构建和部署时间
echo.
echo 构建时间: %DATE% %TIME%
echo.
