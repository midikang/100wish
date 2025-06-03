@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM 自动化构建脚本 - Windows 批处理版本
REM 用法: build.bat [patch|minor|major]

set "VERSION_TYPE=%~1"
if "%VERSION_TYPE%"=="" set "VERSION_TYPE=patch"

REM 验证版本类型参数
if not "%VERSION_TYPE%"=="patch" if not "%VERSION_TYPE%"=="minor" if not "%VERSION_TYPE%"=="major" (
    echo ❌ 版本类型必须是: patch, minor, 或 major
    pause
    exit /b 1
)

echo 🚀 开始自动化构建流程...
echo.

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Node.js，请先安装 Node.js
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

REM 执行构建脚本
echo 🔧 执行构建脚本...
node scripts\build.cjs %VERSION_TYPE%

if errorlevel 1 (
    echo.
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)

echo.
echo 🎉 构建成功完成！
echo 📁 部署文件已生成到 deploy 目录

REM 询问是否要打开部署目录
set /p "OPEN_DEPLOY=是否要打开部署目录？(y/N): "
if /i "!OPEN_DEPLOY!"=="y" (
    explorer deploy
)

REM 询问是否要查看构建报告
set /p "SHOW_REPORT=是否要查看构建报告？(y/N): "
if /i "!SHOW_REPORT!"=="y" (
    if exist "deploy\build-report.json" (
        type deploy\build-report.json
    )
)

echo.
echo 按任意键继续...
pause >nul
