@echo off
echo ===================================
echo 智慧养老综合服务平台启动脚本
echo ===================================
echo.

echo 1. 启动开发环境（后端+管理面板）
echo 2. 启动后端服务器（开发模式）
echo 3. 启动后端服务器（生产模式）
echo 4. 启动管理员面板
echo 5. 启动老人端应用
echo 6. 启动家属端应用
echo 7. 启动护工端应用
echo 8. 安装所有依赖
echo.

set /p choice=请选择要执行的操作 (1-8): 

if "%choice%"=="1" (
    echo 正在启动开发环境（后端+管理面板）...
    start cmd /k npm run start:all
) else if "%choice%"=="2" (
    echo 正在启动后端服务器（开发模式）...
    start cmd /k npm run dev:server
) else if "%choice%"=="3" (
    echo 正在启动后端服务器（生产模式）...
    start cmd /k npm run start:server
) else if "%choice%"=="4" (
    echo 正在启动管理员面板...
    start cmd /k npm run dev:admin
) else if "%choice%"=="5" (
    echo 正在启动老人端应用...
    start cmd /k npm run dev:elderly
) else if "%choice%"=="6" (
    echo 正在启动家属端应用...
    start cmd /k npm run dev:family
) else if "%choice%"=="7" (
    echo 正在启动护工端应用...
    start cmd /k npm run dev:nurse
) else if "%choice%"=="8" (
    echo 正在安装所有依赖...
    npm run install:all
) else (
    echo 无效的选择！
)

echo.
echo 操作完成！
pause 