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
  
  for (const clientWish of clientWishes) {
    const [wish, created] = await Wish.findOrCreate({
      where: { id: clientWish.id },
      defaults: clientWish
    });
    
    if (!created && new Date(clientWish.updatedAt) > wish.updatedAt) {
      await wish.update(clientWish);
    }
  }
  
  const updatedWishes = await Wish.findAll({
    order: [['updatedAt', 'DESC']]
  });
  
  res.json(updatedWishes);
}));
