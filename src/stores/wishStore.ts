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
    }
  }
});  