# 创建临时部署目录
$deployDir = ".\deploy\server"
New-Item -ItemType Directory -Force -Path $deployDir

# 复制服务器文件
Copy-Item ".\server\*" -Destination $deployDir -Recurse -Force
Copy-Item ".\server\models" -Destination $deployDir -Recurse -Force
Copy-Item ".\server\routes" -Destination $deployDir -Recurse -Force

# 删除不需要的文件和目录
Remove-Item "$deployDir\data" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$deployDir\node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# 创建压缩文件
Compress-Archive -Path "$deployDir\*" -DestinationPath ".\deploy\server.zip" -Force

# 清理临时目录
Remove-Item $deployDir -Recurse -Force

Write-Host "服务器文件已打包到 deploy/server.zip"
