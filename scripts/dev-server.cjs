#!/usr/bin/env node

/**
 * 开发环境启动脚本
 * 用于在没有 PM2 的环境下启动服务
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class DevServer {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.deployDir = path.join(this.rootDir, 'deploy');
    this.serverFile = path.join(this.deployDir, 'server', 'index.js');
  }

  // 检查部署目录
  checkDeployDir() {
    if (!fs.existsSync(this.deployDir)) {
      console.log('❌ 部署目录不存在');
      console.log('💡 请先执行构建: npm run build:auto');
      process.exit(1);
    }

    if (!fs.existsSync(this.serverFile)) {
      console.log('❌ 服务器文件不存在');
      console.log('💡 请先执行构建: npm run build:auto');
      process.exit(1);
    }
  }

  // 显示启动信息
  showStartInfo() {
    try {
      const reportPath = path.join(this.deployDir, 'build-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        console.log('🚀 启动开发服务器...');
        console.log(`📦 版本: ${report.version}`);
        console.log(`🕒 构建时间: ${new Date(report.buildTime).toLocaleString()}`);
        console.log('🌐 服务地址: http://localhost:3000');
        console.log('🛑 按 Ctrl+C 停止服务\n');
      }
    } catch (error) {
      console.log('🚀 启动开发服务器...');
      console.log('🌐 服务地址: http://localhost:3000');
      console.log('🛑 按 Ctrl+C 停止服务\n');
    }
  }

  // 启动服务
  startServer() {
    const server = spawn('node', ['server/index.js'], {
      cwd: this.deployDir,
      stdio: 'inherit'
    });

    // 处理进程退出
    server.on('close', (code) => {
      if (code !== 0) {
        console.log(`\n❌ 服务器进程退出，代码: ${code}`);
      } else {
        console.log('\n✅ 服务器已停止');
      }
    });

    // 处理错误
    server.on('error', (error) => {
      console.error('❌ 启动服务器失败:', error.message);
      process.exit(1);
    });

    // 处理中断信号
    process.on('SIGINT', () => {
      console.log('\n🛑 正在停止服务器...');
      server.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 正在停止服务器...');
      server.kill('SIGTERM');
    });
  }

  // 主执行函数
  run() {
    this.checkDeployDir();
    this.showStartInfo();
    this.startServer();
  }
}

// 执行启动
const devServer = new DevServer();
devServer.run();
