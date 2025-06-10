@echo off
REM filepath: D:\Lab\2025\100wishplan\scripts\test-local-server.bat
chcp 65001 >nul
color 0A
echo ===== 本地开发服务器测试 =====

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0\test-local-server.ps1"

pause
