# 设置输出编码为UTF-8，避免中文显示问题
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$BASE_URL = "https://100wish.midikang.com"
if ($args.Count -gt 0) {
    $BASE_URL = $args[0]
}

Write-Host "===== 100wishplan API 同步端点验证 ====="
Write-Host "使用基础URL: $BASE_URL"

# 检查API健康状态
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API 健康检查成功" -ForegroundColor Green
    } else {
        Write-Host "❌ API 健康检查失败: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API 不可访问: $($_.Exception.Message)" -ForegroundColor Red
}

# 检查同步端点配置
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/check-sync" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 同步端点配置检查成功" -ForegroundColor Green
        $syncJson = $response.Content | ConvertFrom-Json
        
        if ($syncJson.endpoints.sync -eq '/api/wishes/sync') {
            Write-Host "✅ /api/wishes/sync 端点配置正确" -ForegroundColor Green
        } else {
            Write-Host "❌ 同步端点配置错误: $($syncJson.endpoints.sync)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ 同步端点配置检查失败: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 同步端点配置检查失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试同步端点 OPTIONS 请求（CORS预检）
try {
    $headers = @{
        'Origin' = $BASE_URL
        'Access-Control-Request-Method' = 'POST'
    }
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/wishes/sync" -Method OPTIONS -Headers $headers -UseBasicParsing
    
    if ($response.StatusCode -eq 204 -or $response.StatusCode -eq 200) {
        Write-Host "✅ /api/wishes/sync 端点 OPTIONS 请求成功" -ForegroundColor Green
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
        Write-Host "❌ /api/wishes/sync 端点 OPTIONS 请求异常: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ /api/wishes/sync 端点 OPTIONS 请求失败: $($_.Exception.Message)" -ForegroundColor Red
}

# 测试同步端点 POST 请求
try {
    $headers = @{
        'Content-Type' = 'application/json'
        'Origin' = $BASE_URL
    }
    $body = @{
        test = "test_sync"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/wishes/sync" -Method POST -Headers $headers -Body $body -UseBasicParsing
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ /api/wishes/sync 端点 POST 请求成功" -ForegroundColor Green
        Write-Host "  响应内容: $($response.Content)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ /api/wishes/sync 端点 POST 请求异常: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ /api/wishes/sync 端点 POST 请求失败: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n===== 验证完成 ====="
