# This script packages server files for deployment

# Determine project root directory
$scriptPath = $MyInvocation.MyCommand.Path
$scriptDir = Split-Path -Parent $scriptPath
$rootDir = Split-Path -Parent $scriptDir

Write-Output "Script path: $scriptPath"
Write-Output "Script directory: $scriptDir" 
Write-Output "Project root: $rootDir"

# Create temporary packaging directory
$tempDir = Join-Path $rootDir "scripts\temp_server_package"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

# Ensure deploy directory exists
$deployDir = Join-Path $rootDir "deploy"
if (-not (Test-Path $deployDir)) {
    New-Item -ItemType Directory -Force -Path $deployDir | Out-Null
    Write-Output "Created new deployment directory: $deployDir"
}

# Copy server files (excluding node_modules and data files)
Write-Output "Copying server files..."
$serverDir = Join-Path $rootDir "server"

# Check if server directory exists
if (-not (Test-Path $serverDir)) {
    Write-Output "ERROR: Server directory not found: $serverDir"
    exit 1
}

# Copy basic files
if (-not (Test-Path -Path (Join-Path $serverDir "index.js"))) {
    Write-Output "ERROR: Server file not found: index.js"
    exit 1
}

# Copy required server files
Copy-Item -Path (Join-Path $serverDir "index.js") -Destination $tempDir -Force
Copy-Item -Path (Join-Path $serverDir "package.json") -Destination $tempDir -Force
Copy-Item -Path (Join-Path $serverDir "ecosystem.config.cjs") -Destination $tempDir -Force
if (Test-Path -Path (Join-Path $serverDir "deploy.sh")) {
    Copy-Item -Path (Join-Path $serverDir "deploy.sh") -Destination $tempDir -Force
}

# Ensure target directories exist
New-Item -ItemType Directory -Force -Path "$tempDir\models" | Out-Null
New-Item -ItemType Directory -Force -Path "$tempDir\routes" | Out-Null

# Copy models directory
if (Test-Path -Path (Join-Path $serverDir "models")) {
    Write-Output "Copying models directory..."
    Get-ChildItem -Path (Join-Path $serverDir "models") -File | ForEach-Object {
        Write-Output "  Copying file: models\$($_.Name)"
        Copy-Item $_.FullName -Destination "$tempDir\models\" -Force
    }
} else {
    Write-Output "WARNING: models directory not found"
}

# Copy routes directory
if (Test-Path -Path (Join-Path $serverDir "routes")) {
    Write-Output "Copying routes directory..."
    Get-ChildItem -Path (Join-Path $serverDir "routes") -File | ForEach-Object {
        Write-Output "  Copying file: routes\$($_.Name)"
        Copy-Item $_.FullName -Destination "$tempDir\routes\" -Force
    }
} else {
    Write-Output "WARNING: routes directory not found"
}

Write-Output "Server files copied successfully"

# Create empty data directory structure
New-Item -ItemType Directory -Force -Path "$tempDir\data" | Out-Null

# Create .env.production file with correct settings
$envContent = "NODE_ENV=production"
$envContent += "`r`nPORT=3000"
Set-Content -Path "$tempDir\.env.production" -Value $envContent -Encoding ASCII -Force

# Create zip archive
Write-Output "Creating server code archive..."
$serverZipPath = Join-Path $deployDir "server.zip"
# Remove existing zip if it exists
if (Test-Path $serverZipPath) {
    Remove-Item $serverZipPath -Force
    Write-Output "Removed existing server.zip file"
}
# Create the archive
try {
    Compress-Archive -Path "$tempDir\*" -DestinationPath $serverZipPath -Force
    if (Test-Path $serverZipPath) {
        $fileSize = (Get-Item $serverZipPath).Length
        Write-Output "Archive created successfully: $serverZipPath ($fileSize bytes)"
    } else {
        Write-Output "ERROR: Failed to create archive"
        exit 1
    }
} catch {
    Write-Output "ERROR: Exception creating archive: $_"
    exit 1
}

# Clean up temporary directory
Remove-Item $tempDir -Recurse -Force

# Output completion messages
Write-Output "[SUCCESS] Server files packaged to: $serverZipPath"
Write-Output "[NOTE] Archive does not include node_modules"
Write-Output "[NOTE] Run 'npm install' on the server to install dependencies"
