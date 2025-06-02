<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWishStore } from '../stores/wishStore'
import type { Wish } from '../types/wish'
import AchievementPanel from '../components/rewards/AchievementPanel.vue'

// 获取路由实例和参数
const route = useRoute()
const router = useRouter()
const wishStore = useWishStore()

// 当前显示的愿望数据
const wish = ref<Wish | null>(null)

// 在组件挂载时获取愿望数据
onMounted(() => {
  const wishId = Number(route.params.id)
  const foundWish = wishStore.wishes.find(w => w.id === wishId)
  
  if (foundWish) {
    wish.value = foundWish
  } else {
    // 如果找不到愿望，返回首页
    router.push('/')
  }
})
</script>

<template>
  <div class="wish-detail" v-if="wish">
    <div class="detail-header">
      <h1>{{ wish.title }}</h1>
      <button 
        class="edit-btn"
        @click="router.push(`/wish/${wish.id}/edit`)"
      >
        编辑愿望
      </button>
    </div>

    <div class="detail-content">
      <div class="main-info">
        <p class="description">{{ wish.description }}</p>
        
        <div v-if="wish.progress" class="progress-section">
          <h3>进展情况</h3>
          <div class="progress-info">
            <p><strong>当前进度：</strong>{{ wish.progress.current }}</p>
            <p v-if="wish.progress.next"><strong>下一步：</strong>{{ wish.progress.next }}</p>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${wish.progress.percentage || 0}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rewards-section">
        <AchievementPanel :wish="wish" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wish-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.detail-header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-gray-900);
}

.edit-btn {
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.main-info {
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-gray-700);
  margin-bottom: 2rem;
}

.progress-section {
  background-color: var(--color-gray-50);
  padding: 1.5rem;
  border-radius: var(--radius-md);
}

.progress-section h3 {
  margin-bottom: 1rem;
  color: var(--color-gray-900);
}

.progress-info p {
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 8px;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  margin-top: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .wish-detail {
    padding: 1rem;
  }
}
</style>
