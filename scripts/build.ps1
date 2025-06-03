# 自动化构建脚本 - Windows PowerShell 版本
# 用法: .\build.ps1 [patch|minor|major]

param(
    [Parameter()]
    [ValidateSet("patch", "minor", "major")]
    [string]$VersionType = "patch"
)

Write-Host "🚀 开始自动化构建流程..." -ForegroundColor Green

# 检查 Node.js 是否安装
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未找到 Node.js，请先安装 Node.js" -ForegroundColor Red
    exit 1
}

# 检查是否在项目根目录
if (-not (Test-Path "package.json")) {
    Write-Host "❌ 请在项目根目录下执行此脚本" -ForegroundColor Red
    exit 1
}

# 执行构建脚本
try {
    Write-Host "🔧 执行构建脚本..." -ForegroundColor Yellow
    node scripts/build.cjs $VersionType
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 构建成功完成！" -ForegroundColor Green
        Write-Host "📁 部署文件已生成到 deploy 目录" -ForegroundColor Cyan
        
        # 询问是否要打开部署目录
        $openDeploy = Read-Host "是否要打开部署目录？(y/N)"
        if ($openDeploy -eq "y" -or $openDeploy -eq "Y") {
            Invoke-Item "deploy"
        }
        
        # 询问是否要查看构建报告
        $showReport = Read-Host "是否要查看构建报告？(y/N)"
        if ($showReport -eq "y" -or $showReport -eq "Y") {
            if (Test-Path "deploy/build-report.json") {
                Get-Content "deploy/build-report.json" | ConvertFrom-Json | ConvertTo-Json -Depth 4
            }
        }
    } else {
        Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ 执行构建脚本时发生错误: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
