# 设置输出编码为UTF-8，避免中文显示问题
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===== 100wishplan 环境检查 ====="

# 检查Node.js版本
try {
    $nodeVersion = (node --version)
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装或不在PATH中" -ForegroundColor Red
}

# 检查npm版本
try {
    $npmVersion = (npm --version)
    Write-Host "✅ npm 版本: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm 未安装或不在PATH中" -ForegroundColor Red
}

# 检查项目目录结构
$rootDir = "D:\Lab\2025\100wishplan"
$requiredDirs = @("server", "src", "scripts", "deploy")
$requiredFiles = @("package.json", "server\index.js", "server\routes\wishes.js")

Write-Host "`n检查项目目录结构..."
foreach ($dir in $requiredDirs) {
    $path = Join-Path $rootDir $dir
    if (Test-Path $path -PathType Container) {
        Write-Host "✅ 目录存在: $dir" -ForegroundColor Green
    } else {
        Write-Host "❌ 目录不存在: $dir" -ForegroundColor Red
    }
}

foreach ($file in $requiredFiles) {
    $path = Join-Path $rootDir $file
    if (Test-Path $path -PathType Leaf) {
        Write-Host "✅ 文件存在: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ 文件不存在: $file" -ForegroundColor Red
    }
}

# 检查package.json中的版本号
$packageJsonPath = Join-Path $rootDir "package.json"
if (Test-Path $packageJsonPath) {
    try {
        $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
        Write-Host "`n项目信息:"
        Write-Host "  名称: $($packageJson.name)" -ForegroundColor Cyan
        Write-Host "  版本: $($packageJson.version)" -ForegroundColor Cyan
        Write-Host "  描述: $($packageJson.description)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ 无法解析 package.json" -ForegroundColor Red
    }
}

# 检查是否能连接到服务器
$serverHost = "100wish.midikang.com"
Write-Host "`n检查服务器连接..."
$ping = Test-Connection -ComputerName $serverHost -Count 1 -Quiet
if ($ping) {
    Write-Host "✅ 可以连接到服务器: $serverHost" -ForegroundColor Green
    
    # 检查HTTP和HTTPS连接
    try {
        $response = Invoke-WebRequest -Uri "https://$serverHost" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ HTTPS连接正常: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ HTTPS连接失败: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    try {
        $response = Invoke-WebRequest -Uri "http://$serverHost" -UseBasicParsing -TimeoutSec 5
        Write-Host "✅ HTTP连接正常: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ HTTP连接失败: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ 无法连接到服务器: $serverHost" -ForegroundColor Red
}

Write-Host "`n===== 环境检查完成 ====="
