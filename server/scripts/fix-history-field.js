// 用于补全 wishes 表所有历史数据的 history 字段
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

// 批量补全 history 字段
const sql = "UPDATE wishes SET history = '[]' WHERE history IS NULL OR history = ''";
db.run(sql, function(err) {
  if (err) {
    console.error('补全 history 字段失败:', err.message);
  } else {
    console.log(`已补全 ${this.changes} 条记录的 history 字段`);
  }
  db.close();
});
