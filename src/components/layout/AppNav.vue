<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSyncStore } from '../../stores/syncStore'
import { useOnline } from '@vueuse/core'
import ThemeSwitcher from '../ThemeSwitcher.vue'

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
      </router-link>      <div class="nav-actions">
        <ThemeSwitcher />
        <div class="divider"></div>        
        <div class="sync-container">
          <span class="sync-status" :class="{ offline: !online }">
            {{ online ? syncStore.syncStatus : '离线模式' }}
          </span>
          <button
            v-if="online"
            @click="sync"
            class="sync-btn"
            :disabled="syncStore.syncing"
            :class="{ 'has-changes': syncStore.hasPendingChanges }"
          >
            <span class="sync-icon">↻</span>
            {{ syncStore.syncing ? '同步中...' : '同步' }}
          </button>
        </div>
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
.app-nav {  background: var(--surface-1);
  box-shadow: var(--shadow);
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
  color: var(--primary);
}

.nav-brand h1 {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
}

.new-wish-btn {
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.new-wish-btn:hover {
  background: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.sync-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sync-status {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.sync-status.offline {
  color: var(--warning);
}

.sync-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--surface-1);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sync-btn:hover:not(:disabled) {
  background: var(--surface-2);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.sync-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sync-btn.has-changes {
  background: var(--primary);
  color: white;
  border-color: transparent;
}

.sync-btn.has-changes:hover:not(:disabled) {
  background: var(--accent);
  transform: translateY(-1px) scale(1.02);
}

.sync-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.sync-btn:hover .sync-icon {
  transform: rotate(180deg);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: var(--border-color);
  margin: 0 0.5rem;
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

  .theme-switcher {
    display: none;
  }
}
</style>
