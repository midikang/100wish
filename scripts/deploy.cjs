#!/usr/bin/env node

/**
 * 快速部署脚本
 * 功能：
 * 1. 执行构建
 * 2. 重启 PM2 服务
 * 3. 验证部署状态
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeployScript {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.deployDir = path.join(this.rootDir, 'deploy');
  }

  // 检查部署目录是否存在
  checkDeployDir() {
    if (!fs.existsSync(this.deployDir)) {
      console.log('❌ 部署目录不存在，请先执行构建');
      console.log('💡 运行: npm run build:auto 或 node scripts/build.js');
      process.exit(1);
    }
  }
  // 检查 PM2 是否可用
  checkPM2Available() {
    try {
      execSync('pm2 --version', { stdio: 'pipe' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // 停止现有服务
  stopService() {
    if (!this.checkPM2Available()) {
      console.log('ℹ️  PM2 未安装，跳过服务停止步骤');
      return;
    }

    try {
      console.log('🛑 停止现有服务...');
      execSync('pm2 stop 100wishplan', { stdio: 'pipe' });
      console.log('✅ 服务已停止');
    } catch (error) {
      console.log('ℹ️  服务未运行或停止失败，继续部署...');
    }
  }

  // 启动服务
  startService() {
    if (!this.checkPM2Available()) {
      console.log('⚠️  PM2 未安装，将使用开发模式启动服务');
      console.log('💡 请安装 PM2 用于生产环境: npm install -g pm2');
      this.startDevMode();
      return;
    }

    try {
      console.log('🚀 启动服务...');
      execSync('pm2 start ecosystem.config.js', { 
        stdio: 'inherit',
        cwd: this.deployDir 
      });
      console.log('✅ 服务已启动');
    } catch (error) {
      console.error('❌ 启动服务失败:', error.message);
      console.log('💡 尝试使用开发模式启动...');
      this.startDevMode();
    }
  }

  // 开发模式启动
  startDevMode() {
    try {
      console.log('🔧 使用开发模式启动服务...');
      console.log('📍 部署目录:', this.deployDir);
      console.log('🌐 访问地址: http://localhost:3000');
      console.log('💡 手动启动命令: cd deploy && node server/index.js');
      
      // 不直接启动，只提供信息
      console.log('✅ 部署准备完成，请手动启动服务');
    } catch (error) {
      console.error('❌ 开发模式启动失败:', error.message);
    }
  }

  // 验证服务状态
  verifyService() {
    if (!this.checkPM2Available()) {
      console.log('ℹ️  PM2 未安装，跳过服务状态验证');
      return;
    }

    try {
      console.log('🔍 验证服务状态...');
      const output = execSync('pm2 list', { encoding: 'utf8' });
      
      if (output.includes('100wishplan') && output.includes('online')) {
        console.log('✅ 服务运行正常');
        
        // 显示服务信息
        execSync('pm2 show 100wishplan', { stdio: 'inherit' });
      } else {
        console.log('⚠️  服务状态异常，请检查');
        console.log(output);
      }
    } catch (error) {
      console.error('❌ 验证服务状态失败:', error.message);
    }
  }

  // 显示部署信息
  showDeployInfo() {
    try {
      const reportPath = path.join(this.deployDir, 'build-report.json');
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        console.log('\n📊 部署信息:');
        console.log(`   版本: ${report.version}`);
        console.log(`   构建时间: ${new Date(report.buildTime).toLocaleString()}`);
        console.log(`   文件总数: ${report.files.length}`);
        console.log(`   总大小: ${(report.size / 1024 / 1024).toFixed(2)} MB`);
      }
    } catch (error) {
      console.log('ℹ️  无法读取构建报告');
    }
  }

  // 主执行函数
  run() {
    console.log('🚀 开始快速部署流程...\n');
    
    this.checkDeployDir();
    this.stopService();
    this.startService();
    this.verifyService();
    this.showDeployInfo();
    
    console.log('\n🎉 部署完成！');
    console.log('🌐 访问地址: http://localhost:3000');
  }
}

// 执行部署
const deployScript = new DeployScript();
deployScript.run();
