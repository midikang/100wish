import { defineStore } from 'pinia'
import type { Wish } from '../types/wish'
import { wishDb } from '../db';

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
    wishes: [],
    loading: false,
    error: null
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
        const wishes = await wishDb.getAllWishes();
        this.wishes = wishes.map(wish => {
          const progress = wish.progress? {
            current: wish.progress.current || '',
            next: wish.progress.next || ''
          } : { current: '', next: '' };
          return {
            ...wish,
            progress
          };
        });
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
    async addWish(wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      this.error = null;
      
      try {
        const newWish = await wishDb.addWish({
          ...wish,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        const progress = newWish.progress? {
          current: newWish.progress.current || '',
          next: newWish.progress.next || ''
        } : { current: '', next: '' };
        
        this.wishes.push({
          ...newWish,
          progress
        });
        
        return newWish;
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
        // 处理 progress 对象
        const formattedUpdates = { ...updates };
        if (updates.progress) {
          formattedUpdates.progress = {
            current: updates.progress.current || '',
            next: updates.progress.next || ''
          };
          delete formattedUpdates.progress;
        }
        
        const updatedWish = await wishDb.updateWish(id, formattedUpdates);
        
        if (updatedWish) {
          const index = this.wishes.findIndex(w => w.id === id);
          if (index > -1) {
            const progress = updatedWish.progress? {
              current: updatedWish.progress.current || '',
              next: updatedWish.progress.next || ''
            } : { current: '', next: '' };

            this.wishes[index] = {
              ...updatedWish,
              progress
            };
          }
        }
        
        return updatedWish;
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
        await wishDb.deleteWish(id);
        this.wishes = this.wishes.filter(wish => wish.id !== id);
        return true;
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