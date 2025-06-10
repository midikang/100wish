@echo off
REM filepath: D:\Lab\2025\100wishplan\scripts\test-package-server.bat
chcp 65001 >nul
cls
color 0A

echo ===== 测试服务器打包脚本 =====
echo.

echo 删除已有的zip文件...
if exist "D:\Lab\2025\100wishplan\deploy\server.zip" (
  del /f "D:\Lab\2025\100wishplan\deploy\server.zip"
  echo - 已删除旧的server.zip
)

echo 运行打包脚本...
powershell -NoProfile -ExecutionPolicy Bypass -File "D:\Lab\2025\100wishplan\scripts\package-server.ps1"

echo.
if exist "D:\Lab\2025\100wishplan\deploy\server.zip" (
  echo [成功] server.zip 文件已创建
  echo 文件路径: D:\Lab\2025\100wishplan\deploy\server.zip
  echo 文件大小: 
  for %%I in ("D:\Lab\2025\100wishplan\deploy\server.zip") do echo %%~zI bytes
) else (
  echo [错误] server.zip 文件创建失败
)

echo.
echo ===== 测试完成 =====
pause
