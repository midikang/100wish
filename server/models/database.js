import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 确保数据目录存在
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// 创建表
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
    progress TEXT DEFAULT '{"current":"","next":"","percentage":0}',
    rewards TEXT DEFAULT '{"points":0,"badges":[],"milestones":[]}',
    motivation INTEGER DEFAULT 0,
    streakDays INTEGER DEFAULT 0,
    lastUpdated DATETIME,
    history TEXT DEFAULT '[]', -- 新增字段，存储历史记录
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.serialize(() => {
  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Wishes table created or already exists');
    }
  });
});

// 数据库操作辅助函数
export const dbOperations = {
  // 获取所有愿望
  getAllWishes: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM wishes ORDER BY createdAt DESC';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // 解析 JSON 字段
          const wishes = rows.map(row => ({
            ...row,
            progress: JSON.parse(row.progress || '{}'),
            rewards: JSON.parse(row.rewards || '{}'),
            history: JSON.parse(row.history || '[]')
          }));
          resolve(wishes);
        }
      });
    });
  },

  // 根据 ID 获取愿望
  getWishById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM wishes WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const wish = {
            ...row,
            progress: JSON.parse(row.progress || '{}'),
            rewards: JSON.parse(row.rewards || '{}'),
            history: JSON.parse(row.history || '[]')
          };
          resolve(wish);
        } else {
          resolve(null);
        }
      });
    });
  },
  // 创建新愿望
  createWish: (wishData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO wishes (
          title, description, status, progress, rewards, 
          motivation, streakDays, lastUpdated, history, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      const params = [
        wishData.title,
        wishData.description || null,
        wishData.status || 'pending',
        JSON.stringify(wishData.progress || {}),
        JSON.stringify(wishData.rewards || {}),
        wishData.motivation || 0,
        wishData.streakDays || 0,
        wishData.lastUpdated || null,
        JSON.stringify(wishData.history || [])
      ];
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          // 返回创建的记录
          dbOperations.getWishById(this.lastID).then(resolve).catch(reject);
        }
      });
    });
  },

  // 更新愿望
  updateWish: (id, wishData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE wishes 
        SET title = ?, description = ?, status = ?, progress = ?, rewards = ?, 
            motivation = ?, streakDays = ?, lastUpdated = ?, history = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      const params = [
        wishData.title,
        wishData.description || null,
        wishData.status || 'pending',
        JSON.stringify(wishData.progress || {}),
        JSON.stringify(wishData.rewards || {}),
        wishData.motivation || 0,
        wishData.streakDays || 0,
        wishData.lastUpdated || null,
        JSON.stringify(wishData.history || []),
        id
      ];
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // 没有找到记录
        } else {
          // 返回更新后的记录
          dbOperations.getWishById(id).then(resolve).catch(reject);
        }
      });
    });
  },

  // 删除愿望
  deleteWish: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM wishes WHERE id = ?';
      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  },

  // 批量同步操作
  syncWishes: async (clientWishes) => {
    try {
      // 获取所有服务器端愿望
      const serverWishes = await dbOperations.getAllWishes();
      const serverWishMap = new Map(serverWishes.map(w => [w.id, w]));
      const clientWishIds = new Set(clientWishes.map(w => w.id));

      // 处理客户端数据
      for (const clientWish of clientWishes) {
        const serverWish = serverWishMap.get(clientWish.id);
        
        if (!serverWish) {
          // 服务器端不存在，创建新记录
          await dbOperations.createWish(clientWish);
        } else if (new Date(clientWish.updatedAt) > new Date(serverWish.updatedAt)) {
          // 客户端版本更新，更新服务器数据
          await dbOperations.updateWish(clientWish.id, clientWish);
        }
      }

      // 返回最新的所有数据
      return await dbOperations.getAllWishes();
    } catch (error) {
      throw error;
    }
  }
};

export default db;
