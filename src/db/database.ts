import Dexie, { type Table } from 'dexie'
import type { Wish } from '../types/wish'

export class WishDatabase extends Dexie {
  wishes!: Table<Wish, number>

  constructor() {
    super('wishDatabase')
    this.version(1).stores({
      wishes: '++id, title, status, progress, createdAt, updatedAt'
    })
  }
}

export const db = new WishDatabase()

// 初始化示例数据
export async function initializeDatabase() {
  const count = await db.wishes.count()
  if (count === 0) {
    const sampleWishes = [
      {
          id: 1,
          title: "创建记录愿望实现过程的网站",
          description: "开发一个网站用于记录和追踪100个愿望的实现过程",
          status: "completed" as const,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 2,
          title: "开发网页版电子琴",
          description: "实现一个网页版的电子琴应用",
          status: "in-progress" as const,
          progress: {
            current: "已实现三个八度的钢琴键，支持鼠标点击弹奏",
            next: "加入电脑键盘显示功能，按键以彩虹颜色显示",
            percentage: 0
          },
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 3,
          title: "编写安卓版电子琴应用",
          description: "在安卓平台上实现电子琴应用",
          status: "pending" as const,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 4,
          title: "开发网页版国际象棋游戏",
          description: "实现一个支持在线对战的国际象棋游戏",
          status: "pending" as const,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 5,
          title: "编写MQTT服务器管理应用",
          description: "开发一个MQTT服务器的管理界面",
          status: "pending" as const,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 6,
          title: "研究AI编程在工作中的实际应用",
          description: "探索AI编程助手在实际工作中的应用场景",
          status: "in-progress" as const,
          progress: {
            current: "正在研究提高工作效率的方案",
            next: "制定防止公司资产泄露的策略",
            percentage: 0
          },
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 7,
          title: "利用Nodejs实现J2EE的经典宠物店应用",
          description: "使用现代技术栈重新实现经典的宠物店应用",
          status: "pending" as const,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 8,
          title: "实现WMS系统",
          description: "基于富乐的标准数据库开发仓库管理系统",
          status: "pending" as const,
          progress: {
            current: "正在分析数据库结构",
            next: "设计系统架构",
            percentage: 0
          },
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 9,
          title: "开发网上订餐系统",
          description: "实现2003年大学时期构想的网上订餐系统",
          status: "pending" as const,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 10,
          title: "开发温湿度监测系统",
          description: "使用ESP32和传感器实现温湿度监测系统",
          status: "in-progress" as const,
          progress: {
            current: "已完成硬件选型",
            next: "开始编写ESP32固件",
            percentage: 0
          },
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        },
        {
          id: 11,
          title: "在网页电子琴基础上实现编码功能",
          description: "为网页电子琴添加简谱转换和自动弹奏功能",
          status: "pending" as const,
          progress: {
            current: "正在设计编码格式",
            next: "实现简谱解析算法",
            percentage: 0
          },
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
        }
    ]
    await db.wishes.bulkAdd(sampleWishes)
  }
}