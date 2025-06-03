# 创建临时打包目录
$tempDir = ".\temp_server_package"
New-Item -ItemType Directory -Force -Path $tempDir

# 复制服务器文件 (不包括 node_modules 和数据文件)
Write-Host "正在复制必要的服务器文件..."
Copy-Item ".\server\index.js" -Destination $tempDir -Force
Copy-Item ".\server\package.json" -Destination $tempDir -Force
Copy-Item ".\server\deploy.sh" -Destination $tempDir -Force
Copy-Item ".\server\models" -Destination "$tempDir\models" -Recurse -Force
Copy-Item ".\server\routes" -Destination "$tempDir\routes" -Recurse -Force

# 创建空的数据目录结构
New-Item -ItemType Directory -Force -Path "$tempDir\data"
New-Item -Path "$tempDir\.env.production" -ItemType File -Value "NODE_ENV=production`nPORT=3000" -Force

# 创建压缩文件
Write-Host "正在创建服务器代码压缩包..."
Compress-Archive -Path "$tempDir\*" -DestinationPath ".\deploy\server.zip" -Force

# 清理临时目录
Remove-Item $tempDir -Recurse -Force

Write-Host "✅ 服务器文件已打包到 deploy/server.zip"
Write-Host "注意：压缩包中不包含 node_modules，需要在服务器上运行 npm install 安装依赖"
