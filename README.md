# 我的100个愿望计划

这是一个用于追踪和管理个人愿望清单的Vue3应用程序。通过这个应用，你可以记录、更新和追踪你的愿望实现过程。

## 检查
- 停止现有的服务并重新启动：
netstat -ano | findstr :3000

- 查找所有 node 进程
Get-Process | Where-Object { $_.ProcessName -eq "node" }

## 项目特点

- 使用 Vue 3 + TypeScript + Vite 构建
- 基于 Composition API 和 `<script setup>` 语法
- 使用 Pinia 进行状态管理
- 响应式设计，支持移动端和桌面端
- 实时进度追踪
- 分类管理

## 功能列表

- 愿望清单展示
- 添加新愿望
- 更新愿望状态
- 记录实现进度
- 查看详细信息

## 开发指南

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发服务器启动

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 🚀 自动化构建和部署

项目提供了完整的自动化构建部署系统：

#### Windows 用户（一键启动）
```cmd
# 一键构建、部署并启动应用
scripts\start-app.bat

# 指定版本类型：patch（补丁）、minor（次版本）、major（主版本）
scripts\start-app.bat patch
```

#### 使用 npm 脚本
```bash
# 自动构建（递增版本号）
npm run build:auto

# 构建特定版本类型
npm run build:minor    # 次版本更新
npm run build:major    # 主版本更新

# 快速部署
npm run deploy:quick

# 启动开发服务器
npm run dev-server

# 一键构建并部署
npm run version:patch  # 构建补丁版本并部署
```

#### 脚本功能说明
- **自动版本管理**: 读取并递增 `version.md` 中的版本号
- **构建打包**: 自动执行 vite 构建并优化资源
- **部署准备**: 将构建结果和服务器文件复制到 `deploy` 目录
- **构建报告**: 生成详细的构建信息和文件统计
- **开发服务器**: 支持不依赖 PM2 的开发环境启动

详细文档请参阅：[构建脚本说明](scripts/README.md)

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Material Design Icons

## 项目结构

```
src/                    # 前端源码
├── components/         # Vue 组件
│   ├── layout/         # 布局组件（导航栏等）
│   ├── wishes/         # 愿望相关组件
│   └── rewards/        # 奖励系统组件
├── views/              # 页面组件
├── router/             # 路由配置
├── stores/             # Pinia 状态管理
│   ├── wishStore.ts    # 愿望数据状态
│   ├── syncStore.ts    # 同步状态管理
│   └── themeStore.ts   # 主题状态管理
├── config/             # 配置文件
│   ├── themes.ts       # 主题配置
│   └── api.config.ts   # API 配置
├── services/           # 服务层
├── types/              # TypeScript 类型定义
├── styles/             # 全局样式
│   ├── themes.css      # 主题样式
│   └── main.css        # 主样式文件
└── assets/             # 静态资源

server/                 # 后端服务
├── index.js           # 服务器入口文件
├── package.json       # 服务端依赖配置
├── models/            # 数据模型
│   ├── database.js    # 数据库连接
│   └── wish.js        # 愿望数据模型
├── routes/            # API 路由
│   └── wishes.js      # 愿望相关 API
└── data/              # 数据存储
    └── database.sqlite # SQLite 数据库文件

scripts/               # 构建和部署脚本
├── build.cjs         # 主构建脚本
├── deploy.cjs        # 部署脚本
├── dev-server.cjs    # 开发服务器脚本
├── start-app.bat     # Windows 一键启动脚本
└── README.md         # 脚本使用文档

deploy/               # 部署目录（构建生成）
├── assets/          # 前端构建资源
├── server/          # 后端服务文件
├── build-report.json # 构建报告
└── package.json     # 部署配置
```

## 许可证

MIT License

## 作者

Created with ❤️ in 2025
