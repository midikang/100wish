#!/bin/bash

# 自动化构建脚本 - Linux/macOS 版本
# 用法: ./build.sh [patch|minor|major]

set -e

VERSION_TYPE=${1:-patch}

# 验证版本类型参数
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "❌ 版本类型必须是: patch, minor, 或 major"
    exit 1
fi

echo "🚀 开始自动化构建流程..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录下执行此脚本"
    exit 1
fi

# 执行构建脚本
echo "🔧 执行构建脚本..."
node scripts/build.cjs "$VERSION_TYPE"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 构建成功完成！"
    echo "📁 部署文件已生成到 deploy 目录"
    
    # 询问是否要打开部署目录（仅 macOS）
    if [[ "$OSTYPE" == "darwin"* ]]; then
        read -p "是否要打开部署目录？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open deploy
        fi
    fi
    
    # 询问是否要查看构建报告
    read -p "是否要查看构建报告？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f "deploy/build-report.json" ]; then
            cat deploy/build-report.json | python3 -m json.tool 2>/dev/null || cat deploy/build-report.json
        fi
    fi
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
