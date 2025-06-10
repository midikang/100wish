# 设置输出编码为UTF-8，避免中文显示问题
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "===== 本地开发服务器测试 ====="

# 检查本地服务器是否运行
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 本地API服务器运行中" -ForegroundColor Green
    } else {
        Write-Host "❓ 本地API服务器返回异常状态: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ 本地API服务器未运行或无法访问，准备启动" -ForegroundColor Yellow
    Write-Host "  错误信息: $($_.Exception.Message)"
    
    # 尝试启动服务器
    Write-Host "`n正在启动本地服务器..."
    $serverProcess = Start-Process -FilePath "node" -ArgumentList "D:\Lab\2025\100wishplan\server\index.js" -NoNewWindow -PassThru
    
    # 等待服务器启动
    Write-Host "等待服务器启动 (5秒)..."
    Start-Sleep -Seconds 5
    
    # 再次检查服务器是否运行
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ 本地API服务器已成功启动" -ForegroundColor Green
        } else {
            Write-Host "❌ 本地API服务器启动异常: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ 本地API服务器启动失败" -ForegroundColor Red
        Write-Host "  错误信息: $($_.Exception.Message)"
        exit 1
    }
}

# 测试同步端点 OPTIONS 请求（CORS预检）
try {
    $headers = @{
        'Origin' = 'http://localhost:5173'
        'Access-Control-Request-Method' = 'POST'
    }
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/wishes/sync" -Method OPTIONS -Headers $headers -UseBasicParsing
    
    if ($response.StatusCode -eq 204 -or $response.StatusCode -eq 200) {
        Write-Host "✅ 本地/api/wishes/sync 端点 OPTIONS 请求成功" -ForegroundColor Green
        Write-Host "  返回的CORS头:"
        $corsHeaders = @('Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers')
        foreach ($header in $corsHeaders) {
            if ($response.Headers[$header]) {
                Write-Host "  - $header: $($response.Headers[$header])" -ForegroundColor Cyan
            } else {
                Write-Host "  - $header: 未设置" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "❌ 本地/api/wishes/sync 端点 OPTIONS 请求异常: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 本地/api/wishes/sync 端点 OPTIONS 请求失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n===== 测试完成 ====="
