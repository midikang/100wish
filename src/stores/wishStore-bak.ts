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
   * 包含初始的示例愿望数据
   */  state: (): WishState => ({
    wishes: [
      {
        id: 1,
        title: "创建记录愿望实现过程的网站",
        description: "去南极看看企鹅和极光",
        status: "in-progress",
        progress: {
          current: "正在搭建网站框架",
          next: "添加数据库sqlite"
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 2,
        title: "开发网页版电子琴",
        description: "",
        status: "in-progress",
        progress: {
          current: "已实现三个八度的钢琴键，支持鼠标点击弹奏",
          next: "加入电脑键盘显示功能，按键以彩虹颜色显示"
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 3,
        title: "编写安卓版电子琴应用",
        description: "",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 4,
        title: "开发网页版国际象棋游戏",
        description: "",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 5,
        title: "编写MQTT服务器管理应用",
        description: "",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 6,
        title: "研究AI编程在工作中的实际应用",
        description: "提高工作效率，防止公司资产泄露",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 7,
        title: "利用Nodejs实现J2EE的经典宠物店应用",
        description: "",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 8,
        title: "实现WMS系统",
        description: "采用富乐的标准数据库",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 9,
        title: "开发网上订餐系统",
        description: "2003年大学时期的创意",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 10,
        title: "开发温湿度监测系统",
        description: "结合ESP32和温湿度传感器",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 11,
        title: "在网页电子琴基础上实现编码功能",
        description: "将简谱转换成特定编码，实现自动弹奏",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 12,
        title: "实现一个听歌转换成简谱的工具",
        description: "先转换成简谱，再转换成编码，实现自动弹奏。",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      },
      {
        id: 13,
        title: "再次研究三十年前小霸王学习机手册中的音乐编曲",
        description: "",
        status: "pending",
        progress: {
          current: "",
          next: ""
        },
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      }
    ]
  }),

  /**
   * Store的获取器
   */
  getters: {
    /**
     * 获取所有愿望
     * @returns - 返回愿望列表
     */
    inProgressWishes(state): Wish[] {
      return state.wishes.filter(wish => wish.status === 'in-progress');
    },
    /**
     * 获取已完成的愿望
     * @returns - 返回已完成的愿望列表
     */
    completedWishes(state): Wish[] {
      return state.wishes.filter(wish => wish.status === 'completed');
    },
    /**
     * 获取待处理的愿望
     * @returns - 返回待处理的愿望列表
     */
    pendingWishes(state): Wish[] {
      return state.wishes.filter(wish => wish.status === 'pending');
    },

    // allWishes(): Wish[] {
    //   return this.wishes;
    // },

    /**
     * 根据 ID 获取特定愿望
     * @param id - 愿望的唯一标识符
     * @returns - 返回对应 ID 的愿望或 undefined
     */
    // getWishById: (state) => (id: number): Wish | undefined => {
    //   return state.wishes.find(wish => wish.id === id);
    // }

  /**
   * Store 的操作方法集合
   */
  actions: {
    /**
     * 添加新的愿望
     * @param wish - 新愿望的数据（不包含 id 和时间戳）
     */
    addWish(wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>) {
      const now = new Date().toLocaleString();
      const newWish: Wish = {
        ...wish,
        id: Math.max(0, ...this.wishes.map(w => w.id)) + 1,
        createdAt: now,
        updatedAt: now
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
          updatedAt: new Date().toLocaleString() // 更新最后修改时间
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
