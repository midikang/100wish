# CORS 错误修复指南

## 问题描述

出现以下错误表明存在跨域资源共享 (CORS) 问题：

```
Access to XMLHttpRequest at 'https://100wish.midikang.com/api/wishes/sync' from origin 'http://100wish.midikang.com' has been blocked by CORS policy
```

## 错误原因

这个错误的主要原因是：
- 前端使用 HTTP 协议 (http://100wish.midikang.com)
- 后端使用 HTTPS 协议 (https://100wish.midikang.com)
- 不同的协议被浏览器视为不同的源，触发了 CORS 保护机制

## 解决方案

### 方案 1：统一使用 HTTPS（推荐）

最佳做法是将所有流量统一到 HTTPS：

1. 在宝塔面板中开启强制 HTTPS：
   - 进入网站设置
   - 开启 "强制 HTTPS"
   - 保存设置

2. 添加 301 重定向规则到 Nginx 配置：
```nginx
server {
    listen 80;
    server_name 100wish.midikang.com;
    return 301 https://$host$request_uri;
}
```

### 方案 2：更新后端 CORS 配置（已实施）

我们已经更新了服务器代码以允许多个来源访问：

```javascript
app.use(cors({
  origin: ['http://100wish.midikang.com', 'https://100wish.midikang.com', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### 方案 3：更新 Nginx 配置

在 Nginx 配置中添加 CORS 头：

```nginx
server {
    # 其他配置...
    
    # 添加 CORS 头
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        
        # CORS 设置
        add_header 'Access-Control-Allow-Origin' 'http://100wish.midikang.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # 处理 OPTIONS 请求
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'http://100wish.midikang.com' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
```

## 部署和验证

1. 重新部署服务器代码：
```bash
cd /www/wwwroot/100wish.midikang.com
./deploy.sh
```

2. 重启 Nginx：
```bash
systemctl restart nginx
```

3. 验证 API 是否正常工作：
```bash
curl -X GET https://100wish.midikang.com/api/health
```

4. 检查是否返回成功响应：
```json
{"status":"ok","message":"Server is running"}
```

5. 验证浏览器中的应用是否能正常同步

## 调试方法

如果问题仍然存在，可以尝试以下诊断步骤：

1. 查看服务器错误日志：
```bash
pm2 logs 100wishplan
```

2. 检查 Nginx 日志：
```bash
tail -f /var/log/nginx/error.log
```

3. 使用浏览器开发者工具检查网络请求，特别是 OPTIONS 预检请求的响应头

4. 尝试使用 curl 模拟 CORS 请求：
```bash
curl -X OPTIONS -H "Origin: http://100wish.midikang.com" -H "Access-Control-Request-Method: POST" https://100wish.midikang.com/api/wishes/sync -v
```

## 其他注意事项

1. 确保前端项目中的 API 请求包含正确的域名和协议
2. 如果使用混合内容 (HTTP/HTTPS)，某些浏览器可能会默认阻止请求
3. 考虑统一使用 HTTPS 以提高安全性
