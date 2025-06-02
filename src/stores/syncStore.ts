import { defineStore } from 'pinia'
import { useWishStore } from './wishStore'
import { wishApi } from '../services/api'
import { useOnline } from '@vueuse/core'

export const useSyncStore = defineStore('sync', {
  state: () => ({
    syncing: false,
    lastSyncTime: null as Date | null,
    pendingChanges: [] as string[],
    syncError: null as string | null
  }),

  actions: {    async syncWishes() {
      const wishStore = useWishStore()
      const online = useOnline()

      if (!online.value) {
        console.log('离线状态，无法同步')
        return
      }

      if (this.syncing) {
        console.log('同步已在进行中')
        return
      }

      this.syncing = true
      this.syncError = null

      try {
        // 1. 获取并缓存本地数据
        const localWishes = [...wishStore.wishes]  // 创建副本

        // 2. 尝试同步
        const syncedWishes = await wishApi.syncWishes(localWishes)

        // 3. 验证同步数据的完整性
        const localIds = new Set(localWishes.map(w => w.id))
        const syncedIds = new Set(syncedWishes.map(w => w.id))
        
        // 确保没有数据丢失
        if (localIds.size > syncedIds.size) {
          throw new Error('同步后数据不完整，请重试')
        }

        // 4. 更新本地数据
        await wishStore.replaceAllWishes(syncedWishes)

        // 5. 同步成功，更新状态
        this.lastSyncTime = new Date()
        this.pendingChanges = []
        console.log('同步成功，当前愿望数量:', syncedWishes.length)

      } catch (error) {
        console.error('同步失败:', error)
        this.syncError = error instanceof Error ? error.message : '同步失败，请稍后重试'
        
        // 同步失败后的恢复操作
        await wishStore.loadWishes()  // 重新加载本地数据
        
      } finally {
        this.syncing = false
      }
    },

    // 标记有待同步的更改
    markPendingChange(changeId: string) {
      if (!this.pendingChanges.includes(changeId)) {
        this.pendingChanges.push(changeId)
      }
    },

    // 清除同步状态
    clearSyncState() {
      this.lastSyncTime = null
      this.pendingChanges = []
      this.syncError = null
    }
  },

  getters: {
    hasPendingChanges(): boolean {
      return this.pendingChanges.length > 0
    },

    syncStatus(): string {
      if (this.syncing) return '同步中...'
      if (this.syncError) return this.syncError
      if (this.lastSyncTime) return `上次同步: ${this.lastSyncTime.toLocaleString()}`
      return '未同步'
    }
  }
})
