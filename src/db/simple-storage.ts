import type { Wish } from '../types/wish'

// 简化的本地存储系统
export class SimpleStorage {
  private storageKey = 'wishplan-data'

  // 获取所有愿望
  getAllWishes(): Wish[] {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading wishes from localStorage:', error)
      return []
    }
  }

  // 保存所有愿望
  saveAllWishes(wishes: Wish[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(wishes))
    } catch (error) {
      console.error('Error saving wishes to localStorage:', error)
    }
  }

  // 获取单个愿望
  getWishById(id: number): Wish | null {
    const wishes = this.getAllWishes()
    return wishes.find(w => w.id === id) || null
  }

  // 添加愿望
  addWish(wish: Omit<Wish, 'id' | 'createdAt' | 'updatedAt'>): Wish {
    const wishes = this.getAllWishes()
    const newWish: Wish = {
      ...wish,
      id: Date.now(), // 简单的 ID 生成
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    wishes.push(newWish)
    this.saveAllWishes(wishes)
    return newWish
  }

  // 更新愿望
  updateWish(id: number, updates: Partial<Wish>): Wish | null {
    const wishes = this.getAllWishes()
    const index = wishes.findIndex(w => w.id === id)
    
    if (index === -1) return null
    
    wishes[index] = {
      ...wishes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.saveAllWishes(wishes)
    return wishes[index]
  }

  // 删除愿望
  deleteWish(id: number): boolean {
    const wishes = this.getAllWishes()
    const index = wishes.findIndex(w => w.id === id)
    
    if (index === -1) return false
    
    wishes.splice(index, 1)
    this.saveAllWishes(wishes)
    return true
  }

  // 清空所有数据
  clear(): void {
    localStorage.removeItem(this.storageKey)
  }

  // 批量同步数据
  syncWithServer(serverWishes: Wish[]): void {
    // 简单地用服务器数据覆盖本地数据
    this.saveAllWishes(serverWishes)
  }
}

// 单例实例
export const simpleStorage = new SimpleStorage()

// 初始化示例数据（如果需要）
export function initializeSampleData() {
  const wishes = simpleStorage.getAllWishes()
  if (wishes.length === 0) {
    const sampleWishes = [
      {
        title: "创建记录愿望实现过程的网站",
        description: "开发一个网站用于记录和追踪100个愿望的实现过程",
        status: "completed" as const
      },
      {
        title: "开发网页版电子琴",
        description: "实现一个网页版的电子琴应用",
        status: "in-progress" as const,
        progress: {
          current: "已实现三个八度的钢琴键，支持鼠标点击弹奏",
          next: "加入电脑键盘显示功能，按键以彩虹颜色显示",
          percentage: 60
        }
      },
      {
        title: "编写安卓版电子琴应用",
        description: "在安卓平台上实现电子琴应用",
        status: "pending" as const
      }
    ]

    sampleWishes.forEach(wish => {
      simpleStorage.addWish(wish)
    })
  }
}
