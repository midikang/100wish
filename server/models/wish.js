import { DataTypes, Model } from 'sequelize';
import sequelize from './database.js';

class Wish extends Model {}

Wish.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending'
  },
  progress: {
    type: DataTypes.JSON,
    defaultValue: {
      current: '',
      next: '',
      percentage: 0
    }
  },
  rewards: {
    type: DataTypes.JSON,
    defaultValue: {
      points: 0,
      badges: [],
      milestones: []
    }
  },
  motivation: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  streakDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastUpdated: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'Wish',
  timestamps: true // 这会自动添加 createdAt 和 updatedAt
});

export default Wish;
