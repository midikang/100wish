#!/usr/bin/env node

/**
 * 自动化构建脚本
 * 功能：
 * 1. 读取 version.md 中的版本号
 * 2. 自动递增版本号（支持 patch/minor/major）
 * 3. 更新 package.json 中的版本
 * 4. 执行构建命令
 * 5. 将构建结果复制到 deploy 目录
 * 6. 生成构建报告
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BuildScript {
  constructor() {
    this.rootDir = path.resolve(__dirname, '..');
    this.versionFile = path.join(this.rootDir, 'version.md');
    this.packageFile = path.join(this.rootDir, 'package.json');
    this.deployDir = path.join(this.rootDir, 'deploy');
    this.distDir = path.join(this.rootDir, 'dist');
  }  // 读取当前版本号
  readVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageFile, 'utf8'));
      const version = packageJson.version || '0.0.0';
      const match = version.match(/(\d+)\.(\d+)\.(\d+)/);
      
      if (!match) {
        throw new Error('package.json 中的版本号格式不正确，期望格式：1.2.3');
      }
      
      return {
        major: parseInt(match[1]) || 0,
        minor: parseInt(match[2]) || 0,
        patch: parseInt(match[3]) || 0,
        raw: version
      };
    } catch (error) {
      console.error('❌ 读取版本号失败:', error.message);
      process.exit(1);
    }
  }

  // 递增版本号
  incrementVersion(type = 'patch') {
    const version = this.readVersion();
    
    switch (type) {
      case 'major':
        version.major++;
        version.minor = 0;
        version.patch = 0;
        break;
      case 'minor':
        version.minor++;
        version.patch = 0;
        break;
      case 'patch':
      default:
        version.patch++;
        break;
    }    const newVersionString = `${version.major}.${version.minor}.${version.patch}`;
    return { ...version, string: newVersionString };
  }

  // 更新版本文件
  updateVersionFile(version) {
    try {
      // 同时更新 version.md 文件（保持向后兼容）
      const versionMdContent = `v${version.string}\n`;
      fs.writeFileSync(this.versionFile, versionMdContent);
      console.log(`✅ 更新 version.md: v${version.string}`);
    } catch (error) {
      console.error('❌ 更新版本文件失败:', error.message);
      process.exit(1);
    }
  }
  // 更新 package.json 版本
  updatePackageVersion(version) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageFile, 'utf8'));
      packageJson.version = version.string;
      fs.writeFileSync(this.packageFile, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`✅ 更新 package.json 版本: ${version.string}`);
    } catch (error) {
      console.error('❌ 更新 package.json 失败:', error.message);  
      process.exit(1);
    }
  }

  // 执行构建
  runBuild() {
    try {
      console.log('🔨 开始构建项目...');
      execSync('npm run build', { 
        stdio: 'inherit', 
        cwd: this.rootDir 
      });
      console.log('✅ 项目构建完成');
    } catch (error) {
      console.error('❌ 构建失败:', error.message);
      process.exit(1);
    }
  }

  // 创建部署目录
  createDeployDir() {
    try {
      if (fs.existsSync(this.deployDir)) {
        fs.rmSync(this.deployDir, { recursive: true, force: true });
      }
      fs.mkdirSync(this.deployDir, { recursive: true });
      console.log('✅ 创建部署目录');
    } catch (error) {
      console.error('❌ 创建部署目录失败:', error.message);
      process.exit(1);
    }
  }

  // 复制构建文件到部署目录
  copyToDeploy(version) {
    try {
      if (!fs.existsSync(this.distDir)) {
        throw new Error('dist 目录不存在，请先执行构建');
      }

      // 复制 dist 内容到 deploy
      this.copyDirectory(this.distDir, this.deployDir);
      
      // 复制服务器文件
      const serverSrc = path.join(this.rootDir, 'server');
      const serverDest = path.join(this.deployDir, 'server');
      if (fs.existsSync(serverSrc)) {
        this.copyDirectory(serverSrc, serverDest);
      }

      // 复制必要的配置文件
      const configFiles = ['package.json', 'ecosystem.config.js'];
      configFiles.forEach(file => {
        const src = path.join(this.rootDir, file);
        const dest = path.join(this.deployDir, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      });

      console.log('✅ 文件复制到部署目录完成');
    } catch (error) {
      console.error('❌ 复制文件失败:', error.message);
      process.exit(1);
    }
  }

  // 递归复制目录
  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  // 生成构建报告
  generateBuildReport(version) {
    try {
      const timestamp = new Date().toISOString();
      const report = {
        version: `v${version.string}`,
        buildTime: timestamp,
        files: this.getFileList(this.deployDir),
        size: this.getDirectorySize(this.deployDir)
      };

      const reportPath = path.join(this.deployDir, 'build-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log('✅ 生成构建报告');
      console.log(`📊 构建版本: v${version.string}`);
      console.log(`📊 构建时间: ${timestamp}`);
      console.log(`📊 总大小: ${(report.size / 1024 / 1024).toFixed(2)} MB`);
      
    } catch (error) {
      console.error('❌ 生成构建报告失败:', error.message);
    }
  }

  // 获取文件列表
  getFileList(dir, baseDir = dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (entry.isDirectory()) {
        files.push(...this.getFileList(fullPath, baseDir));
      } else {
        files.push({
          path: relativePath,
          size: fs.statSync(fullPath).size
        });
      }
    }
    
    return files;
  }

  // 计算目录大小
  getDirectorySize(dir) {
    let totalSize = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        totalSize += this.getDirectorySize(fullPath);
      } else {
        totalSize += fs.statSync(fullPath).size;
      }
    }
    
    return totalSize;
  }

  // 主执行函数
  run(versionType = 'patch') {
    console.log('🚀 开始自动化构建流程...\n');
    
    // 1. 递增版本号
    const newVersion = this.incrementVersion(versionType);
    this.updateVersionFile(newVersion);
    this.updatePackageVersion(newVersion);
    
    // 2. 执行构建
    this.runBuild();
    
    // 3. 准备部署
    this.createDeployDir();
    this.copyToDeploy(newVersion);
    
    // 4. 生成报告
    this.generateBuildReport(newVersion);
      console.log(`\n🎉 构建完成！版本 v${newVersion.string} 已准备好部署`);
    console.log(`📁 部署文件位置: ${this.deployDir}`);
  }
}

// 命令行参数处理
const args = process.argv.slice(2);
const versionType = args[0] || 'patch';

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('❌ 版本类型必须是: patch, minor, 或 major');
  process.exit(1);
}

// 执行构建
const buildScript = new BuildScript();
buildScript.run(versionType);
