import express from 'express';
import asyncHandler from 'express-async-handler';
import Wish from '../models/wish.js';
import { Op } from 'sequelize';

export const router = express.Router();

// 获取所有愿望
router.get('/', asyncHandler(async (req, res) => {
  const wishes = await Wish.findAll({
    order: [['createdAt', 'DESC']]
  });
  res.json(wishes);
}));

// 获取单个愿望
router.get('/:id', asyncHandler(async (req, res) => {
  const wish = await Wish.findByPk(req.params.id);
  if (!wish) {
    res.status(404).json({ message: 'Wish not found' });
    return;
  }
  res.json(wish);
}));

// 创建新愿望
router.post('/', asyncHandler(async (req, res) => {
  const wish = await Wish.create(req.body);
  res.status(201).json(wish);
}));

// 更新愿望
router.put('/:id', asyncHandler(async (req, res) => {
  const [updated] = await Wish.update(req.body, {
    where: { id: req.params.id }
  });
  if (!updated) {
    res.status(404).json({ message: 'Wish not found' });
    return;
  }
  const wish = await Wish.findByPk(req.params.id);
  res.json(wish);
}));

// 删除愿望
router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await Wish.destroy({
    where: { id: req.params.id }
  });
  if (!deleted) {
    res.status(404).json({ message: 'Wish not found' });
    return;
  }
  res.json({ message: 'Wish deleted successfully' });
}));

// 同步愿望数据
router.post('/sync', asyncHandler(async (req, res) => {
  const clientWishes = req.body;
  const clientWishIds = new Set(clientWishes.map(w => w.id));
  
  try {
    // 1. 获取所有服务器端的愿望
    const serverWishes = await Wish.findAll();
    const serverWishIds = new Set(serverWishes.map(w => w.id));
    
    // 2. 处理客户端的数据
    for (const clientWish of clientWishes) {
      const serverWish = serverWishes.find(w => w.id === clientWish.id);
      
      if (!serverWish) {
        // 服务器端不存在，创建新记录
        await Wish.create(clientWish);
      } else if (new Date(clientWish.updatedAt) > serverWish.updatedAt) {
        // 客户端版本更新，更新服务器数据
        await serverWish.update(clientWish);
      }
    }
    
    // 3. 确保客户端有所有服务器端的数据
    for (const serverWish of serverWishes) {
      if (!clientWishIds.has(serverWish.id)) {
        // 客户端缺少此记录，需要在响应中包含
        clientWishes.push(serverWish.toJSON());
      }
    }
    
    // 4. 返回完整的同步后数据
    const finalWishes = await Wish.findAll({
      order: [['updatedAt', 'DESC']]
    });
    
    res.json(finalWishes);
    
  } catch (error) {
    console.error('同步失败:', error);
    res.status(500).json({
      message: '同步失败，请重试',
      error: error.message
    });
  }
}));
