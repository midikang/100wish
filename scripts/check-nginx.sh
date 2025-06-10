# Nginx配置检查脚本
# 用于检查宝塔面板中Nginx配置是否正确设置了API代理

# 保存当前日期时间
DATE_NOW=$(date +"%Y-%m-%d_%H-%M-%S")

# 备份原始配置文件
BACKUP_DIR="/www/backup/nginx_config_$DATE_NOW"
NGINX_CONFIG="/www/server/panel/vhost/nginx/100wish.midikang.com.conf"

echo "===== Nginx 配置检查工具 ====="
echo "检查配置文件: $NGINX_CONFIG"

# 检查配置文件是否存在
if [ ! -f "$NGINX_CONFIG" ]; then
    echo "❌ 错误: 配置文件不存在"
    exit 1
fi

# 创建备份
mkdir -p $BACKUP_DIR
cp $NGINX_CONFIG $BACKUP_DIR/

echo "✅ 创建配置备份: $BACKUP_DIR/$(basename $NGINX_CONFIG)"

# 检查是否包含API代理配置
if grep -q "location /api/" $NGINX_CONFIG; then
    echo "✅ 找到 API 代理配置"
    grep -A 10 "location /api/" $NGINX_CONFIG
else
    echo "❌ 未找到 API 代理配置，准备添加..."
    
    # 检查是否有location /配置块
    if grep -q "location / {" $NGINX_CONFIG; then
        echo "找到主位置块，在之前添加API代理配置..."
        
        # 生成临时文件
        TMP_FILE=$(mktemp)
        
        # 在location /之前添加API代理配置
        awk '/location \/ {/{print "    # API代理配置\n    location /api/ {\n        proxy_pass http://localhost:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection \"upgrade\";\n        proxy_set_header Host $host;\n        proxy_cache_bypass $http_upgrade;\n        \n        # CORS 设置\n        add_header \"Access-Control-Allow-Origin\" \"https://100wish.midikang.com\" always;\n        add_header \"Access-Control-Allow-Methods\" \"GET, POST, PUT, DELETE, OPTIONS\" always;\n        add_header \"Access-Control-Allow-Headers\" \"Content-Type, Authorization\" always;\n        add_header \"Access-Control-Allow-Credentials\" \"true\" always;\n        \n        # 处理 OPTIONS 请求\n        if ($request_method = \"OPTIONS\") {\n            add_header \"Access-Control-Allow-Origin\" \"https://100wish.midikang.com\" always;\n            add_header \"Access-Control-Allow-Methods\" \"GET, POST, PUT, DELETE, OPTIONS\" always;\n            add_header \"Access-Control-Allow-Headers\" \"Content-Type, Authorization\" always;\n            add_header \"Access-Control-Allow-Credentials\" \"true\" always;\n            add_header \"Access-Control-Max-Age\" 1728000;\n            add_header \"Content-Type\" \"text/plain; charset=utf-8\";\n            add_header \"Content-Length\" 0;\n            return 204;\n        }\n    }\n\n"; print}; {print}' $NGINX_CONFIG > $TMP_FILE
        
        # 备份并更新配置
        cp $TMP_FILE $NGINX_CONFIG
        rm $TMP_FILE
        
        echo "✅ 成功添加 API 代理配置"
    else
        echo "⚠️ 无法找到合适的位置添加API配置，请手动修改"
    fi
fi

# 检查HTTPS重定向
if grep -q "return 301 https://\$host\$request_uri" $NGINX_CONFIG; then
    echo "✅ 已配置 HTTPS 重定向"
else
    echo "⚠️ 未找到 HTTPS 重定向配置"
    echo "建议在宝塔面板中开启'强制HTTPS'"
fi

# 检查nginx配置语法
echo "检查 Nginx 配置语法..."
nginx -t

# 提示重启Nginx
echo ""
echo "配置检查完成。如果有修改，请重启Nginx服务:"
echo "systemctl restart nginx"
