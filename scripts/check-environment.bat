@echo off
REM filepath: D:\Lab\2025\100wishplan\scripts\check-environment.bat
chcp 65001 >nul
color 0A
echo ===== 100wishplan 环境检查 =====

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0\check-environment.ps1"

pause
