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

  actions: {
    async syncWishes() {
      const wishStore = useWishStore()
      const online = useOnline()

      if (!online.value) {
        console.log('离线状态，无法同步')
        return
      }

      this.syncing = true
      this.syncError = null

      try {
        // 获取本地数据
        const localWishes = wishStore.wishes

        // 执行同步
        const syncedWishes = await wishApi.syncWishes(localWishes)

        // 更新本地数据
        await wishStore.replaceAllWishes(syncedWishes)

        this.lastSyncTime = new Date()
        this.pendingChanges = []

      } catch (error) {
        console.error('同步失败:', error)
        this.syncError = '同步失败，请稍后重试'
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
