// 自动为 wishes 表添加 history 字段（如不存在）
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.join(__dirname, '../data/database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

// 检查并添加 history 字段
const checkSql = "PRAGMA table_info(wishes)";
db.all(checkSql, [], (err, rows) => {
  if (err) {
    console.error('检查表结构失败:', err.message);
    db.close();
    return;
  }
  const hasHistory = rows.some(col => col.name === 'history');
  if (hasHistory) {
    console.log('history 字段已存在，无需添加');
    db.close();
    return;
  }
  // 添加字段
  const alterSql = "ALTER TABLE wishes ADD COLUMN history TEXT DEFAULT '[]'";
  db.run(alterSql, function(err) {
    if (err) {
      console.error('添加 history 字段失败:', err.message);
    } else {
      console.log('已成功为 wishes 表添加 history 字段');
    }
    db.close();
  });
});
