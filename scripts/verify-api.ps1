# Filepath: D:\Lab\2025\100wishplan\scripts\verify-api.ps1
# API verification script for 100wishplan

Write-Output "Verifying API health and endpoints..."
$HOST_URL = "https://100wish.midikang.com"

try {
    # Health check
    $response = Invoke-WebRequest -Uri "$HOST_URL/api/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "[SUCCESS] API health check passed" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] API health check failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] API health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    # Sync endpoint configuration check
    $response = Invoke-WebRequest -Uri "$HOST_URL/api/check-sync" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "[SUCCESS] API sync configuration check passed" -ForegroundColor Green
        $syncJson = $response.Content | ConvertFrom-Json
        if ($syncJson.endpoints.sync -eq '/api/wishes/sync') {
            Write-Host "[SUCCESS] /api/wishes/sync endpoint correctly configured" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Sync endpoint misconfigured: $($syncJson.endpoints.sync)" -ForegroundColor Red
        }
    } else {
        Write-Host "[ERROR] API sync configuration check failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] API sync configuration check failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    # Test OPTIONS request to sync endpoint
    $headers = @{
        'Origin' = $HOST_URL
        'Access-Control-Request-Method' = 'POST'
    }
    $response = Invoke-WebRequest -Uri "$HOST_URL/api/wishes/sync" -Method OPTIONS -Headers $headers -UseBasicParsing
    
    if ($response.StatusCode -eq 204 -or $response.StatusCode -eq 200) {
        Write-Host "[SUCCESS] /api/wishes/sync OPTIONS request succeeded" -ForegroundColor Green
        
        # Check if CORS headers are present
        $corsHeaders = @('Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers')
        foreach ($header in $corsHeaders) {
            if ($response.Headers[$header]) {
                Write-Host "  $header: $($response.Headers[$header])" -ForegroundColor Cyan
            } else {
                Write-Host "  $header: Not set" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "[ERROR] /api/wishes/sync OPTIONS request failed: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "[ERROR] /api/wishes/sync OPTIONS request failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Output "API verification completed"
