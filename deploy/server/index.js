import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { router as wishRoutes } from './routes/wishes.js';
import sequelize from './models/database.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(express.json());

// 配置 CORS，允许前端域名访问
app.use(cors({
  origin: ['http://100wish.midikang.com', 'https://100wish.midikang.com', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 安全相关
app.use(helmet({
  contentSecurityPolicy: false, // 适当调整 CSP 策略
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(morgan('dev'));

// 限制请求速率
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
});
app.use(limiter);

// 数据库连接
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Failed to sync database:', err));

// 处理 OPTIONS 预检请求
app.options('*', (req, res) => {
  res.status(200).end();
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 添加调试中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 添加测试端点
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API测试成功' });
});

// 检查同步端点是否可用
app.get('/api/check-sync', (req, res) => {
  res.json({ 
    endpoints: {
      sync: '/api/wishes/sync',
      wishes: '/api/wishes',
      health: '/api/health'
    }
  });
});

// 路由
app.use('/api/wishes', wishRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
