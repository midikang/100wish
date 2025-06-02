<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSyncStore } from '../../stores/syncStore'
import { useOnline } from '@vueuse/core'

const router = useRouter()
const syncStore = useSyncStore()
const online = useOnline()

const navigateToNewWish = () => {
  router.push('/new')
}

const sync = async () => {
  if (!online.value) {
    alert('当前处于离线状态，请检查网络连接')
    return
  }
  await syncStore.syncWishes()
}
</script>

<template>
  <nav class="app-nav">
    <div class="nav-content">
      <router-link to="/" class="nav-brand">
        <h1>我的100个愿望</h1>
      </router-link>

      <div class="nav-actions">
        <span class="sync-status" :class="{ offline: !online }">
          {{ online ? syncStore.syncStatus : '离线模式' }}
        </span>
        <button
          v-if="syncStore.hasPendingChanges && online"
          @click="sync"
          class="sync-btn"
          :disabled="syncStore.syncing"
        >
          {{ syncStore.syncing ? '同步中...' : '同步' }}
        </button>
        <button
          @click="navigateToNewWish"
          class="new-wish-btn"
        >
          新建愿望
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.app-nav {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  text-decoration: none;
  color: var(--color-primary);
}

.nav-brand h1 {
  font-size: 1.25rem;
  font-weight: bold;
}

.new-wish-btn {
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: background-color 0.3s;
}

.new-wish-btn:hover {
  background-color: var(--color-primary-dark);
}

.sync-status {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-right: 1rem;
}

.sync-status.offline {
  color: var(--color-warning);
}

.sync-btn {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-success);
  color: white;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  transition: opacity 0.2s;
}

.sync-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .nav-content {
    padding: 0.75rem;
  }
  
  .nav-brand h1 {
    font-size: 1rem;
  }
  
  .new-wish-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
