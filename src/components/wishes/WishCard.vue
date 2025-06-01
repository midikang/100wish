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

const statusClass = computed(() => ({
  'status-pending': props.wish.status === 'pending',
  'status-progress': props.wish.status === 'in-progress',
  'status-completed': props.wish.status === 'completed'
}))
</script>

<template>
  <div class="wish-card">
    <div class="wish-content">
      <h3 class="wish-title">{{ wish.id }} - {{ wish.title }}</h3>
      <p class="wish-description">{{ wish.description }}</p>
      <div class="wish-progress" v-if="wish.progress">
        <p class="current">当前: {{ wish.progress.current }}</p>
        <p class="next" v-if="wish.progress.next">下一步: {{ wish.progress.next }}</p>
      </div>
      <div :class="['wish-status', statusClass]">
        {{ statusText }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.wish-card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.wish-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.wish-content {
  padding: 1.5rem;
}

.wish-id
.wish-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.75rem;
}

.wish-description {
  color: var(--color-gray-700);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.wish-progress {
  font-size: 0.875rem;
  color: var(--color-gray-700);
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
}

.wish-progress .current {
  margin-bottom: 0.5rem;
}

.wish-progress .next {
  color: var(--color-primary);
}

.wish-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pending {
  background-color: var(--color-warning);
  color: white;
}

.status-progress {
  background-color: var(--color-primary);
  color: white;
}

.status-completed {
  background-color: var(--color-success);
  color: white;
}
</style>
