@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM 一键构建部署启动脚本 - Windows 批处理版本
REM 用法: start-app.bat [patch|minor|major]

echo.
echo ===============================================
echo          🚀 100愿望计划 - 一键启动
echo ===============================================
echo.

set "VERSION_TYPE=%~1"
if "%VERSION_TYPE%"=="" set "VERSION_TYPE=patch"

REM 验证版本类型参数
if not "%VERSION_TYPE%"=="patch" if not "%VERSION_TYPE%"=="minor" if not "%VERSION_TYPE%"=="major" (
    echo ❌ 版本类型必须是: patch, minor, 或 major
    echo 💡 示例: start-app.bat patch
    pause
    exit /b 1
)

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Node.js，请先安装 Node.js
    echo 🔗 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo ✅ Node.js 版本: !NODE_VERSION!

REM 检查是否在项目根目录
if not exist "package.json" (
    echo ❌ 请在项目根目录下执行此脚本
    pause
    exit /b 1
)

echo.
echo 📦 第1步: 构建项目 (版本类型: %VERSION_TYPE%)
echo -----------------------------------------------
call node scripts\build.cjs %VERSION_TYPE%

if errorlevel 1 (
    echo.
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo 🚀 第2步: 准备部署
echo -----------------------------------------------
call node scripts\deploy.cjs

echo.
echo 🌐 第3步: 启动服务器
echo -----------------------------------------------
echo ✅ 准备启动服务器...
echo 🌍 访问地址: http://localhost:3000
echo 🛑 按 Ctrl+C 停止服务器
echo.

REM 询问是否自动打开浏览器
set /p "OPEN_BROWSER=是否自动打开浏览器？(Y/n): "
if /i not "!OPEN_BROWSER!"=="n" (
    timeout /t 2 >nul
    start http://localhost:3000
)

REM 启动服务器
cd deploy
node server\index.js
