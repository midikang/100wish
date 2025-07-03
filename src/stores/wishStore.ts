import { defineStore } from 'pinia'
import type { Wish } from '../types/wish'
import { db, initializeDatabase } from '../db/database'
import { wishApi } from '../services/api' // 引入 API 服务

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
     * 1. 从服务器获取最新数据
     * 2. 清空本地 IndexedDB
     * 3. 将服务器数据存入本地 IndexedDB
     * 4. 更新 Pinia State
     */
    async loadWishes() {
      this.loading = true
      this.error = null

      try {
        await initializeDatabase()
        // 1. 从服务器获取
        const serverWishes = await wishApi.getAllWishes()
        // 2. 清空本地
        await db.wishes.clear()
        // 3. 写入本地
        await db.wishes.bulkAdd(serverWishes)
        // 4. 更新 State
        this.wishes = serverWishes
      } catch (error: any) {
        this.error = error.message || '从服务器加载愿望失败'
        console.error('从服务器加载愿望失败:', error)
        // [可选] 在API失败时，可以尝试从本地数据库加载作为后备
        // this.wishes = await db.wishes.toArray()
      } finally {
        this.loading = false
      }
    },

    /**
     * 添加新的愿望
     * 1. 调用 API 将新愿望发送到服务器
     * 2. 成功后，重新加载所有愿望以确保数据同步
     * @param wish - 新愿望的数据
     */
    async addWish(wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true
      this.error = null

      try {
        // 1. 调用 API 创建愿望
        const newWish = await wishApi.createWish(wish)
        // 2. 重新加载所有愿望列表
        await this.loadWishes()
        return newWish.id
      } catch (error: any) {
        this.error = error.message || '添加愿望失败'
        console.error('添加愿望失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 更新现有愿望的信息
     * @param id - 要更新的愿望 ID
     * @param updates - 要更新的字段和值
     */
    /**
     * 更新现有愿望的信息，并自动追加历史记录
     * @param id - 要更新的愿望 ID
     * @param updates - 要更新的字段和值
     * @param historyDesc - 本次更新的说明（可选）
     */
    async updateWish(id: number, updates: Partial<Wish>, historyDesc?: string) {
      this.loading = true;
      this.error = null;
      try {
        // 1. 获取当前愿望
        const wish = this.wishes.find(w => w.id === id)
        if (!wish) throw new Error('愿望不存在')
        // 2. 构造新的历史记录
        const newHistory = [
          ...(wish.history || []),
          {
            time: new Date().toISOString(),
            desc: historyDesc || '更新愿望',
            data: updates
          }
        ]
        // 3. 合成新的 wish 数据
        const newWish = {
          ...wish,
          ...updates,
          history: newHistory
        }
        // 4. 调用后端 API 更新
        await wishApi.updateWish(id, newWish)
        // 5. 重新加载所有愿望
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
    /**
     * 删除指定的愿望（调用后端 API 并同步本地）
     * @param id - 要删除的愿望 ID
     */
    async deleteWish(id: number) {
      this.loading = true;
      this.error = null;
      try {
        // 1. 调用后端 API 删除
        await wishApi.deleteWish(id);
        // 2. 重新加载所有愿望
        await this.loadWishes();
      } catch (error: any) {
        this.error = error.message || '删除愿望失败';
        console.error('删除愿望失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
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
    },

    /**
     * 更新愿望进度并计算奖励
     */
    async updateProgress(id: number, progressUpdate: { current: string; next?: string; percentage: number }) {
      try {
        const wish = this.wishes.find(w => w.id === id)
        if (!wish) throw new Error('愿望不存在')

        // 计算进度和奖励
        const progress = {
          current: progressUpdate.current,
          next: progressUpdate.next ?? '',
          percentage: progressUpdate.percentage
        }
        let pointsEarned = 10
        let newMotivation = wish.motivation || 50
        const now = new Date()
        const lastUpdate = wish.lastUpdated ? new Date(wish.lastUpdated) : null
        const isConsecutive = lastUpdate && now.getDate() - lastUpdate.getDate() === 1
        let streakDays = wish.streakDays || 0
        if (isConsecutive) {
          streakDays++
          pointsEarned += streakDays * 5
          newMotivation += 10
        } else if (lastUpdate && now.getDate() - lastUpdate.getDate() > 1) {
          streakDays = 1
          newMotivation = Math.max(newMotivation - 20, 0)
        }
        const prevPercentage = wish.progress?.percentage || 0
        if (progressUpdate.percentage > prevPercentage) {
          const progressDiff = progressUpdate.percentage - prevPercentage
          pointsEarned += Math.floor(progressDiff * 2)
          newMotivation += Math.floor(progressDiff * 0.5)
        }
        newMotivation = Math.min(Math.max(newMotivation, 0), 100)
        const milestone = this.checkMilestone(progressUpdate.percentage)
        const prevBadges = wish.rewards?.badges || [];
        const newBadges = milestone && milestone.badge && !prevBadges.includes(milestone.badge)
          ? [...prevBadges, milestone.badge]
          : prevBadges;
        // 组装新的 wish 数据
        const status: 'pending' | 'in-progress' | 'completed' =
          progress.percentage >= 100 ? 'completed' : progress.percentage > 0 ? 'in-progress' : 'pending';
        const updates: Partial<Wish> = {
          progress,
          status,
          rewards: {
            points: (wish.rewards?.points || 0) + pointsEarned,
            badges: newBadges,
            milestones: [
              ...(wish.rewards?.milestones || []),
              milestone && !wish.rewards?.milestones?.some(m => m.description === milestone.description)
                ? {
                    description: milestone.description,
                    achievedAt: new Date().toISOString()
                  }
                : null
            ].filter(Boolean)
          },
          motivation: newMotivation,
          streakDays,
          lastUpdated: new Date().toISOString()
        }
        // 通过 updateWish 追加历史
        await this.updateWish(id, updates, '进度更新')
      } catch (error) {
        console.error('更新进度失败:', error)
        throw error
      }
    },

    /**
     * 替换所有愿望数据（用于同步）
     */
    async replaceAllWishes(wishes: Wish[]) {
      // 清空现有数据
      await db.wishes.clear()
      // 批量添加新数据
      await db.wishes.bulkAdd(wishes)
      // 重新加载数据
      await this.loadWishes()
    },

    /**
     * 生成更改记录ID
     */
    generateChangeId(action: string, wishId: number) {
      return `${action}_${wishId}_${Date.now()}`
    }
  }
})