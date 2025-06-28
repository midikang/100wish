import express from 'express';
import asyncHandler from 'express-async-handler';
import { dbOperations } from '../models/database.js';
import { validateWishData, formatWishData } from '../models/wish.js';

export const router = express.Router();

// 获取所有愿望
router.get('/', asyncHandler(async (req, res) => {
  const wishes = await dbOperations.getAllWishes();
  res.json(wishes);
}));

// 获取单个愿望
router.get('/:id', asyncHandler(async (req, res) => {
  const wish = await dbOperations.getWishById(req.params.id);
  if (!wish) {
    res.status(404).json({ message: 'Wish not found' });
    return;
  }
  res.json(wish);
}));

// 创建新愿望
router.post('/', asyncHandler(async (req, res) => {
  debugger;
  // 验证数据
  const errors = validateWishData(req.body);
  if (errors.length > 0) {
    res.status(400).json({ message: 'Validation failed', errors });
    return;
  }
  
  // 格式化数据
  const wishData = formatWishData(req.body);
  const wish = await dbOperations.createWish(wishData);
  res.status(201).json(wish);
}));

// 更新愿望
router.put('/:id', asyncHandler(async (req, res) => {
  // 验证数据
  const errors = validateWishData(req.body);
  if (errors.length > 0) {
    res.status(400).json({ message: 'Validation failed', errors });
    return;
  }
  
  // 格式化数据
  const wishData = formatWishData(req.body);
  const wish = await dbOperations.updateWish(req.params.id, wishData);
  
  if (!wish) {
    res.status(404).json({ message: 'Wish not found' });
    return;
  }
  res.json(wish);
}));

// 删除愿望
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await dbOperations.deleteWish(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: 'Wish not found' });
    return;
  }
  res.json({ message: 'Wish deleted successfully' });
}));

// 同步愿望数据
router.post('/sync', asyncHandler(async (req, res) => {
  console.log('同步请求已接收, 请求体类型:', typeof req.body, 
    '是数组:', Array.isArray(req.body), 
    '内容长度:', Array.isArray(req.body) ? req.body.length : '未知');
  
  // 确保 req.body 是数组
  const clientWishes = Array.isArray(req.body) ? req.body : [];
  
  try {
    // 使用新的同步方法
    const finalWishes = await dbOperations.syncWishes(clientWishes);
    res.json(finalWishes);
    
  } catch (error) {
    console.error('同步失败:', error);
    res.status(500).json({
      message: '同步失败，请重试',
      error: error.message
    });
  }
}));
