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
app.use(cors());
app.use(helmet());
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
