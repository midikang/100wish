<script setup lang="ts">
import { computed } from 'vue'
import type { Wish } from '../../types/wish'

const props = defineProps<{
  wish: Wish
}>()

const achievementLevel = computed(() => {
  const points = props.wish.rewards?.points || 0
  if (points >= 1000) return { name: '梦想实践家', color: 'gold' }
  if (points >= 500) return { name: '坚持达人', color: 'silver' }
  if (points >= 100) return { name: '初心者', color: 'bronze' }
  return { name: '追梦人', color: 'basic' }
})

const motivationStatus = computed(() => {
  const motivation = props.wish.motivation || 0
  if (motivation >= 90) return '激情满满'
  if (motivation >= 70) return '干劲十足'
  if (motivation >= 50) return '继续加油'
  if (motivation >= 30) return '需要鼓励'
  return '需要重新点燃动力'
})
</script>

<template>
  <div class="achievement-panel">
    <div class="achievement-header">
      <h3>成就与动力</h3>
      <div class="level-badge" :class="achievementLevel.color">
        {{ achievementLevel.name }}
      </div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-item">
        <span class="label">奖励点数</span>
        <span class="value">{{ wish.rewards?.points || 0 }}</span>
      </div>
      <div class="stat-item">
        <span class="label">连续更新</span>
        <span class="value">{{ wish.streakDays || 0 }} 天</span>
      </div>
      <div class="stat-item">
        <span class="label">当前动力</span>
        <span class="value">{{ motivationStatus }}</span>
      </div>
    </div>

    <div v-if="wish.rewards?.badges?.length" class="badges-section">
      <h4>获得的徽章</h4>
      <div class="badges-grid">
        <span 
          v-for="badge in wish.rewards.badges" 
          :key="badge"
          class="badge"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <div v-if="wish.rewards?.milestones?.length" class="milestones-section">
      <h4>重要里程碑</h4>
      <ul class="milestone-list">
        <li 
          v-for="milestone in wish.rewards.milestones" 
          :key="milestone.achievedAt"
        >
          <span class="milestone-date">{{ new Date(milestone.achievedAt).toLocaleDateString() }}</span>
          <span class="milestone-desc">{{ milestone.description }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.achievement-panel {
  background-color: var(--color-background-soft);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.level-badge {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 0.875rem;
}

.level-badge.gold {
  background-color: #ffd700;
  color: #000;
}

.level-badge.silver {
  background-color: #c0c0c0;
  color: #000;
}

.level-badge.bronze {
  background-color: #cd7f32;
  color: white;
}

.level-badge.basic {
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-item .label {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: 0.25rem;
}

.stat-item .value {
  font-weight: 600;
  color: var(--color-primary);
}

.badges-section,
.milestones-section {
  margin-top: 1.5rem;
}

.badges-section h4,
.milestones-section h4 {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--color-gray-700);
}

.badges-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  background-color: var(--color-primary-soft);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.875rem;
}

.milestone-list {
  list-style: none;
  padding: 0;
}

.milestone-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.milestone-date {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  min-width: 100px;
}

.milestone-desc {
  flex: 1;
  margin-left: 1rem;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    padding: 0.5rem 0;
  }
}
</style>
