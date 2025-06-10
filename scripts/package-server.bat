@echo off
REM filepath: D:\Lab\2025\100wishplan\scripts\package-server.bat
chcp 65001 >nul
color 0A
echo ===== 服务器文件打包工具 =====
echo.

cd /d "D:\Lab\2025\100wishplan"
echo 当前目录: %CD%

echo 正在打包服务器文件...
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\package-server.ps1"

echo.
if exist ".\deploy\server.zip" (
  echo [成功] 服务器文件已打包至：
  echo %CD%\deploy\server.zip
) else (
  echo [失败] 打包过程中出错
)

echo.
pause
