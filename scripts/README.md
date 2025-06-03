# 自动化构建和部署脚本

本项目提供了完整的自动化构建和部署解决方案，支持版本管理、自动打包和服务部署。

## 🚀 快速开始

### 🎯 一键启动（推荐新手）

**Windows 用户:**
```cmd
# 一键构建、部署并启动应用
scripts\start-app.bat

# 或指定版本类型
scripts\start-app.bat patch|minor|major
```

**Linux/macOS 用户:**
```bash
# 构建 + 部署 + 启动
npm run version:patch
npm run dev-server
```

### 💼 专业模式

#### 方式一：使用 npm 脚本（推荐）

```bash
# 构建补丁版本 (v0.5 -> v0.6)
npm run build:auto

# 构建次版本 (v0.5 -> v1.0)  
npm run build:minor

# 构建主版本 (v0.5 -> v1.0.0)
npm run build:major

# 快速部署（使用已构建的文件）
npm run deploy:quick

# 启动开发服务器
npm run dev-server

# 一键构建并部署
npm run version:patch   # 补丁版本
npm run version:minor   # 次版本  
npm run version:major   # 主版本
```

### 方式二：直接执行脚本

**Windows (一键脚本):**
```cmd
# 一键构建部署启动
scripts\start-app.bat patch|minor|major

# 单独构建
scripts\build.bat patch|minor|major
```

**Windows (PowerShell):**
```powershell
# 构建
.\scripts\build.ps1 patch|minor|major

# 部署
node scripts\deploy.cjs
```

**Linux/macOS (Bash):**
```bash
# 给脚本执行权限
chmod +x scripts/build.sh

# 构建
./scripts/build.sh patch|minor|major

# 部署
node scripts/deploy.js
```

**跨平台 (Node.js):**
```bash
# 构建
node scripts/build.cjs patch|minor|major

# 部署
node scripts/deploy.cjs
```

## 📋 功能说明

### 构建脚本 (build.js)

自动化构建流程包含以下步骤：

1. **版本管理**
   - 读取 `package.json` 中的当前版本号
   - 根据参数自动递增版本号（patch/minor/major）
   - 更新 `package.json` 中的版本号
   - 同步更新 `version.md` 文件（保持向后兼容）

2. **项目构建**
   - 执行 `npm run build` 构建前端项目
   - 生成优化后的生产版本文件

3. **文件打包**
   - 创建 `deploy` 目录
   - 复制构建结果（dist目录）
   - 复制服务器文件（server目录）
   - 复制配置文件（package.json, ecosystem.config.js等）

4. **构建报告**
   - 生成详细的构建报告 (`deploy/build-report.json`)
   - 包含版本信息、构建时间、文件列表、大小统计

### 部署脚本 (deploy.js)

快速部署流程包含以下步骤：

1. **服务管理**
   - 停止现有的 PM2 服务
   - 从 deploy 目录启动新版本服务
   - 验证服务运行状态

2. **状态检查**
   - 检查服务是否正常运行
   - 显示服务详细信息
   - 展示构建和部署信息

## 📁 目录结构

```
├── scripts/
│   ├── build.cjs      # 主构建脚本（Node.js）
│   ├── build.bat      # Windows 一键构建脚本
│   ├── build.ps1      # Windows PowerShell 脚本
│   ├── build.sh       # Linux/macOS Bash 脚本
│   ├── deploy.cjs     # 部署脚本
│   ├── dev-server.cjs # 开发服务器脚本
│   └── start-app.bat  # Windows 一键启动脚本
├── deploy/            # 构建产物目录（自动生成）
│   ├── assets/        # 前端资源文件
│   ├── server/        # 后端服务文件
│   ├── package.json   # 项目配置
│   ├── ecosystem.config.js  # PM2 配置
│   └── build-report.json    # 构建报告
├── version.md         # 版本号文件
└── package.json       # 项目配置
```

## 🔧 版本号规则

项目使用语义化版本控制 (Semantic Versioning)，版本号存储在 `package.json` 中：

- **patch** (补丁版本): 修复bug，向后兼容 `1.0.1 -> 1.0.2`
- **minor** (次版本): 新增功能，向后兼容 `1.0.1 -> 1.1.0`
- **major** (主版本): 重大更改，可能不向后兼容 `1.0.1 -> 2.0.0`

版本号会同时更新到以下文件：
- `package.json` - 主版本号存储位置
- `version.md` - 保持向后兼容性

## 📊 构建报告示例

```json
{
  "version": "v0.6.0",
  "buildTime": "2024-01-15T08:30:00.000Z",
  "files": [
    {
      "path": "index.html",
      "size": 1024
    },
    {
      "path": "assets/index-abc123.js", 
      "size": 245760
    }
  ],
  "size": 2048576
}
```

## 🚨 注意事项

1. **环境要求**
   - Node.js 16+ 
   - PM2 (用于生产环境部署)
   - Git (用于版本控制)

2. **首次使用**
   - 确保 `package.json` 中有正确的版本号格式（如 "1.0.0"）
   - 确保 `ecosystem.config.js` 配置正确
   - 建议先在开发环境测试构建流程

3. **权限问题**
   - Linux/macOS 需要给 shell 脚本执行权限
   - Windows 可能需要设置 PowerShell 执行策略

4. **部署验证**
   - 构建完成后检查 deploy 目录内容
   - 部署后访问 http://localhost:3000 验证服务
   - 查看 PM2 日志确认服务运行正常

## 🔍 故障排除

**构建失败:**
- 检查 Node.js 版本是否符合要求
- 确认所有依赖包已正确安装 (`npm install`)
- 查看错误日志确定具体问题

**部署失败:**
- 确认 PM2 已全局安装 (`npm install -g pm2`)
- 检查端口 3000 是否被占用
- 查看 PM2 日志 (`pm2 logs 100wishplan`)

**版本号问题:**
- 确认 `package.json` 中版本号格式正确 (例: "1.2.3")
- 检查文件读写权限
- 手动修复后重新执行构建
