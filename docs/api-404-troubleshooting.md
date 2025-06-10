# API 404 错误故障排除指南

## 问题描述

当前问题：前端尝试访问 `https://100wish.midikang.com/api/wishes/sync` 时收到 404 Not Found 错误。

## 可能的原因和解决方案

### 1. Express 路由配置问题

**检查点**：服务器中的路由配置是否与前端预期的路径匹配。

**解决方案**：
- 我们已经在 `server/index.js` 中配置了路由：`app.use('/api/wishes', wishRoutes);`
- 确保在 `server/routes/wishes.js` 中有正确的 `/sync` 子路由：`router.post('/sync', ...)`
- 这两者组合应该创建 `/api/wishes/sync` 端点

### 2. Nginx 代理配置问题

**检查点**：Nginx 是否正确转发 API 请求到 Node.js 服务器。

**解决方案**：
检查 Nginx 配置（通常在 `/www/server/nginx/conf/nginx.conf` 或 `/www/server/panel/vhost/nginx/100wish.midikang.com.conf`）：

```nginx
server {
    # ... 其他配置 ...
    
    # 确保有这样的配置块
    location /api/ {
        proxy_pass http://localhost:3000; # 指向 Node.js 服务
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 端口或服务未运行

**检查点**：确认 Node.js 服务正在运行，并且在正确的端口上监听。

**解决方案**：
```bash
# 检查 PM2 进程
pm2 list

# 检查进程详情
pm2 show 100wishplan

# 重启服务
pm2 restart 100wishplan

# 查看日志
pm2 logs 100wishplan
```

### 4. 诊断工具

我们创建了两个诊断工具来帮助排查问题：

1. **API 诊断脚本**：`scripts/api-diagnostics.cjs`
   - 检查各个 API 端点是否可访问
   - 测试同步功能

2. **诊断部署脚本**：`scripts/diagnose-api.bat`
   - 部署最新代码
   - 运行 API 诊断工具

## 测试步骤

1. **执行诊断脚本**：
   ```powershell
   .\scripts\diagnose-api.bat
   ```

2. **检查特定端点**：
   ```bash
   # 在服务器上执行
   curl -X GET https://100wish.midikang.com/api/health
   curl -X GET https://100wish.midikang.com/api/test
   curl -X GET https://100wish.midikang.com/api/check-sync
   ```

3. **检查同步端点**：
   ```bash
   curl -X OPTIONS -H "Origin: https://100wish.midikang.com" -H "Access-Control-Request-Method: POST" https://100wish.midikang.com/api/wishes/sync -v
   ```

## 日志检查

出现 404 错误时，查看以下日志：

1. **Node.js/PM2 日志**：
   ```bash
   pm2 logs 100wishplan
   ```

2. **Nginx 访问日志**：
   ```bash
   tail -f /www/wwwlogs/100wish.midikang.com.log
   ```

3. **Nginx 错误日志**：
   ```bash
   tail -f /www/wwwlogs/100wish.midikang.com.error.log
   ```

## 修复后的验证

修复部署后，使用浏览器访问这个测试页面验证 API 是否正常工作：

1. 打开：https://100wish.midikang.com/api/health
2. 应该看到 JSON 响应：`{"status":"ok","message":"Server is running"}`
3. 然后尝试访问：https://100wish.midikang.com/api/check-sync
4. 验证同步功能是否正常工作

如果仍然遇到问题，请运行诊断脚本并分享结果，以便进一步分析。
