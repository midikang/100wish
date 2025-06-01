import { defineStore } from 'pinia'
import { Wish } from '../types/wish'

/**
 * Pinia Store 的状态接口定义
 */
interface WishState {
  /** 愿望列表数组 */
  wishes: Wish[]
}

/**
 * 愿望管理的 Pinia Store
 * 用于集中管理所有愿望相关的状态和操作
 */
export const useWishStore = defineStore('wish', {
  /**
   * Store 的状态定义
   * 包含初始的示例愿望数据
   */
  state: (): WishState => ({
    wishes: [
      {
        id: 1,
        title: '创建记录愿望实现过程的网站',
        description: '开发一个网站用于记录和追踪100个愿望的实现过程',
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: '开发网页版电子琴',
        description: '实现一个网页版的电子琴应用',
        status: 'in-progress',
        progress: {
          current: '已实现三个八度的钢琴键，支持鼠标点击弹奏',
          future: '加入电脑键盘显示功能，按键以彩虹颜色显示'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }),

  /**
   * Store 的操作方法集合
   */
  actions: {
    /**
     * 添加新的愿望
     * @param wish - 新愿望的数据（不包含 id 和时间戳）
     */
    addWish(wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) {
      const newWish: Wish = {
        ...wish,
        id: this.wishes.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      this.wishes.push(newWish)
    },

    /**
     * 更新现有愿望的信息
     * @param id - 要更新的愿望 ID
     * @param updates - 要更新的字段和值
     */
    updateWish(id: number, updates: Partial<Wish>) {
      const index = this.wishes.findIndex(w => w.id === id)
      if (index > -1) {
        this.wishes[index] = {
          ...this.wishes[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    },

    /**
     * 删除指定的愿望
     * @param id - 要删除的愿望 ID
     */
    deleteWish(id: number) {
      const index = this.wishes.findIndex(w => w.id === id)
      if (index > -1) {
        this.wishes.splice(index, 1)
      }
    }
  }
})
