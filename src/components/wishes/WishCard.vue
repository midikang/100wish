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
    <div class="wish-header">
      <div class="wish-points" v-if="wish.rewards?.points">
        +{{ wish.rewards.points }} 分
      </div>
      <div class="streak-badge" v-if="wish.streakDays && wish.streakDays > 0">
        🔥 {{ wish.streakDays }}天
      </div>
    </div>
    <div class="wish-content">
      <h3 class="wish-title">{{ wish.id }} - {{ wish.title }}</h3>
      <p class="wish-description">{{ wish.description }}</p>
      <div class="motivation-bar" v-if="wish.motivation">
        <div 
          class="motivation-fill"
          :style="{ width: `${wish.motivation}%` }"
          :class="{ 'high': wish.motivation >= 70, 'medium': wish.motivation >= 30 && wish.motivation < 70, 'low': wish.motivation < 30 }"
        ></div>
      </div>
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

.wish-header {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 1rem 1rem 0;
}

.motivation-bar {
  height: 4px;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  margin: 1rem 0;
  overflow: hidden;
}

.motivation-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.motivation-fill.high {
  background-color: #22c55e;
}

.motivation-fill.medium {
  background-color: #eab308;
}

.motivation-fill.low {
  background-color: #ef4444;
}

.wish-points {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
}

.streak-badge {
  background-color: #ffedd5;
  color: #ea580c;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 500;
}

.motivation-bar {
  height: 4px;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  margin-top: 1rem;
  overflow: hidden;
}

.motivation-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.motivation-fill.high {
  background-color: #22c55e;
}

.motivation-fill.medium {
  background-color: #eab308;
}

.motivation-fill.low {
  background-color: #ef4444;
}
</style>
