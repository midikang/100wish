<script setup lang="ts">
import { computed } from 'vue'
import type { Wish } from '../../types/wish'

const props = defineProps<{
  wish: Wish
}>()

const statusText = computed(() => {
  switch (props.wish.status) {
    case 'pending':
      return '待开始'
    case 'in-progress':
      return '进行中'
    case 'completed':
      return '已完成'
  }
})

const statusClass = computed(() => {
  return {
    'bg-gray-100': props.wish.status === 'pending',
    'bg-blue-100': props.wish.status === 'in-progress',
    'bg-green-100': props.wish.status === 'completed'
  }
})
</script>

<template>
  <div class="wish-card hover:shadow-lg transition-shadow duration-300">
    <div class="card-header">
      <h3 class="text-xl font-bold mb-2">{{ wish.title }}</h3>
      <span :class="['status-badge', statusClass]">{{ statusText }}</span>
    </div>
    
    <p class="text-gray-600 mb-4">{{ wish.description }}</p>
    
    <div v-if="wish.progress" class="progress-section">
      <div class="current-progress">
        <h4 class="text-sm font-semibold text-gray-700">当前进展</h4>
        <p class="text-sm text-gray-600">{{ wish.progress.current }}</p>
      </div>
      <div class="future-plans">
        <h4 class="text-sm font-semibold text-gray-700">未来计划</h4>
        <p class="text-sm text-gray-600">{{ wish.progress.future }}</p>
      </div>
    </div>

    <div class="card-footer">
      <span class="text-xs text-gray-500">
        创建于 {{ new Date(wish.createdAt).toLocaleDateString() }}
      </span>
    </div>
  </div>
</template>

<style>
.wish-card {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  border: 1px solid var(--color-gray-200);
  transition: box-shadow 0.3s;
}

.wish-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-4);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.progress-section {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-gray-100);
}

.card-footer {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-gray-100);
}
</style>
