@echo off
REM filepath: D:\Lab\2025\100wishplan\scripts\test-chinese.bat
chcp 65001 >nul
color 0A
cls
echo ===== 中文显示测试 =====
echo.
echo 测试不同的中文字符:
echo 1. 简体中文: 你好，世界！
echo 2. 表情符号测试: 😀 🚀 🎉
echo 3. 特殊符号: ■□△▲○●★☆
echo.
echo 如果以上文字显示正常，则表示字符编码设置正确。
echo.
echo 当前代码页信息:
chcp
echo.
echo 按任意键退出...
pause >nul
