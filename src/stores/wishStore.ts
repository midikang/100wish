import { defineStore } from 'pinia'
import type { Wish } from '../types/wish'
import { db, initializeDatabase } from '../db/database'

/**
 * Pinia Store 的状态接口定义
 */
interface WishState {
  /** 愿望列表数组 */
  wishes: Wish[]
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
}

/**
 * 愿望管理的 Pinia Store
 * 用于集中管理所有愿望相关的状态和操作
 */
export const useWishStore = defineStore('wish', {
  /**
   * Store 的状态定义
   */
  state: (): WishState => ({
    wishes: [] as Wish[],
    loading: false,
    error: null as string | null
  }),

  /**
   * Store 的获取器
   */
  getters: {
    /** 获取进行中的愿望 */
    inProgressWishes(state): Wish[] {
      return state.wishes.filter(wish => wish.status === 'in-progress');
    },
    
    /** 获取已完成的愿望 */
    completedWishes(state): Wish[] {
      return state.wishes.filter(wish => wish.status === 'completed');
    },
    
    /** 获取未开始的愿望 */
    pendingWishes(state): Wish[] {
      return state.wishes.filter(wish => wish.status === 'pending');
    }
  },

  /**
   * Store 的操作方法集合
   */
  actions: {
    /**
     * 初始化加载愿望
     */
    async loadWishes() {
      this.loading = true;
      this.error = null;
      
      try {
        await initializeDatabase()
        this.wishes = await db.wishes.toArray()
      } catch (error: any) {
        this.error = error.message || '加载愿望失败';
        console.error('加载愿望失败:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 添加新的愿望
     * @param wish - 新愿望的数据
     */
    async addWish(wish: Omit<Wish, 'id' >) {
      this.loading = true;
      this.error = null;
      
      try {
        const id = await db.wishes.add({
          ...wish,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        await this.loadWishes()
        return id
      } catch (error: any) {
        this.error = error.message || '添加愿望失败';
        console.error('添加愿望失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 更新现有愿望的信息
     * @param id - 要更新的愿望 ID
     * @param updates - 要更新的字段和值
     */
    async updateWish(id: number, updates: Partial<Wish>) {
      this.loading = true;
      this.error = null;
      
      try {
        await db.wishes.update(id, {
          ...updates,
          updatedAt: new Date().toISOString()
        })
        await this.loadWishes()
      } catch (error: any) {
        this.error = error.message || '更新愿望失败';
        console.error('更新愿望失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 删除指定的愿望
     * @param id - 要删除的愿望 ID
     */
    async deleteWish(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        

        await db.deleteWish(id);
        // todo 待完善，是否要刷新列表？
        // this.wishes = this.wishes.filter(wish => wish.id !== id);
        // return true;
      } catch (error: any) {
        this.error = error.message || '删除愿望失败';
        console.error('删除愿望失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * 更新愿望进度并计算奖励
     */
    async updateProgress(id: number, progressUpdate: { current: string; next?: string; percentage: number }) {
      const wish = this.wishes.find(w => w.id === id)
      if (!wish) return

      // 计算基础奖励点数
      let pointsEarned = 10 // 基础点数
      let newMotivation = wish.motivation || 50 // 默认动力值
      
      // 检查是否需要更新连续天数
      const now = new Date()
      const lastUpdate = wish.lastUpdated ? new Date(wish.lastUpdated) : null
      const isConsecutive = lastUpdate && 
        now.getDate() - lastUpdate.getDate() === 1 // 检查是否是连续的下一天

      // 更新连续天数
      let streakDays = wish.streakDays || 0
      if (isConsecutive) {
        streakDays++
        pointsEarned += streakDays * 5 // 连续更新奖励
        newMotivation += 10 // 连续更新提升动力
      } else if (lastUpdate && now.getDate() - lastUpdate.getDate() > 1) {
        streakDays = 1 // 重置连续天数
        newMotivation = Math.max(newMotivation - 20, 0) // 中断连续降低动力
      }

      // 根据进度变化计算额外奖励
      const prevPercentage = wish.progress?.percentage || 0
      if (progressUpdate.percentage > prevPercentage) {
        const progressDiff = progressUpdate.percentage - prevPercentage
        pointsEarned += Math.floor(progressDiff * 2) // 进度提升奖励
        newMotivation += Math.floor(progressDiff * 0.5) // 进度提升增加动力
      }

      // 确保动力值在 0-100 之间
      newMotivation = Math.min(Math.max(newMotivation, 0), 100)

      // 检查是否达成新的里程碑
      const milestone = this.checkMilestone(progressUpdate.percentage)
      const currentBadges = wish.rewards?.badges || []
      const newBadges = [...currentBadges]
      if (milestone) {
        newBadges.push(milestone.badge)
        pointsEarned += milestone.points
      }

      // 更新愿望数据
      await db.wishes.update(id, {
        progress: progressUpdate,
        rewards: {
          points: (wish.rewards?.points || 0) + pointsEarned,
          badges: newBadges,
          milestones: [...(wish.rewards?.milestones || []), 
            milestone ? {
              description: milestone.description,
              achievedAt: new Date().toISOString()
            } : null
          ].filter(Boolean)
        },
        motivation: newMotivation,
        streakDays,
        lastUpdated: new Date().toISOString()
      })

      await this.loadWishes()
    },

    /**
     * 检查是否达到新的里程碑
     */
    checkMilestone(percentage: number) {
      const milestones = [
        { threshold: 25, badge: '🌱 起步', points: 50, description: '完成25%的进度' },
        { threshold: 50, badge: '🌿 成长', points: 100, description: '完成一半的旅程' },
        { threshold: 75, badge: '🌳 茁壮', points: 150, description: '胜利在望' },
        { threshold: 100, badge: '🎯 达成', points: 300, description: '圆满完成' }
      ]

      // 返回最近达成的里程碑
      return milestones.find(m => m.threshold <= percentage)
    }
  }
});