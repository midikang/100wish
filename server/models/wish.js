// Wish 模型现在由 database.js 中的原生 SQLite 操作处理
// 这个文件保留作为类型定义和验证

export const WishSchema = {
  id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
  title: 'TEXT NOT NULL',
  description: 'TEXT',
  status: "TEXT CHECK(status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending'",
  progress: 'TEXT DEFAULT \'{"current":"","next":"","percentage":0}\'',
  rewards: 'TEXT DEFAULT \'{"points":0,"badges":[],"milestones":[]}\'',
  motivation: 'INTEGER DEFAULT 0',
  streakDays: 'INTEGER DEFAULT 0',
  lastUpdated: 'DATETIME',
  createdAt: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
  updatedAt: 'DATETIME DEFAULT CURRENT_TIMESTAMP'
};

// 验证愿望数据
export function validateWishData(data) {
  const errors = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
    errors.push('Status must be one of: pending, in-progress, completed');
  }
  
  if (data.motivation !== undefined && (typeof data.motivation !== 'number' || data.motivation < 0)) {
    errors.push('Motivation must be a non-negative number');
  }
  
  if (data.streakDays !== undefined && (typeof data.streakDays !== 'number' || data.streakDays < 0)) {
    errors.push('StreakDays must be a non-negative number');
  }
  
  return errors;
}

// 格式化愿望数据
export function formatWishData(data) {
  return {    title: data.title?.trim(),
    description: data.description?.trim() || null,
    status: data.status || 'pending',
    progress: typeof data.progress === 'string' ? JSON.parse(data.progress) : (data.progress || { current: '', next: '', percentage: 0 }),
    rewards: typeof data.rewards === 'string' ? JSON.parse(data.rewards) : (data.rewards || { points: 0, badges: [], milestones: [] }),
    motivation: data.motivation || 0,
    streakDays: data.streakDays || 0,
    lastUpdated: data.lastUpdated || null
    // createdAt 和 updatedAt 由数据库自动处理
  };
}
