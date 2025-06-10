@echo off
REM filepath: D:\Lab\2025\100wishplan\scripts\verify-sync-endpoint.bat
chcp 65001 >nul
color 0A
echo ===== 100wishplan API 同步端点验证 =====

if "%1"=="" (
  echo 使用默认URL: https://100wish.midikang.com
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0\verify-sync-endpoint.ps1" "https://100wish.midikang.com"
) else (
  echo 使用自定义URL: %1
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0\verify-sync-endpoint.ps1" "%1"
)

pause
