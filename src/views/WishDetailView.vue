<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWishStore } from '../stores/wishStore'
import type { Wish } from '../types/wish'

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
    <h1>{{ wish.title }}</h1>
    
    <div class="detail-section">
      <h2>详细描述</h2>
      <p>{{ wish.description }}</p>
    </div>

    <div class="status-section">
      <h2>当前状态</h2>
      <div class="status-badge">
        {{ wish.status === 'pending' ? '待开始' : 
           wish.status === 'in-progress' ? '进行中' : '已完成' }}
      </div>
    </div>

    <div class="progress-section" v-if="wish.progress">
      <h2>进展情况</h2>
      <div class="progress-content">
        <div class="progress-item">
          <h3>当前进展</h3>
          <p>{{ wish.progress.current }}</p>
        </div>
        <div class="progress-item">
          <h3>未来计划</h3>
          <p>{{ wish.progress.next }}</p>
        </div>
      </div>
    </div>

    <div class="timestamps">
      <p>创建时间：{{ new Date(wish.createdAt).toLocaleString() }}</p>
      <p>最后更新：{{ new Date(wish.updatedAt).toLocaleString() }}</p>
    </div>
  </div>
</template>

<style scoped>
.wish-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.detail-section,
.status-section,
.progress-section {
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #f0f0f0;
  font-weight: bold;
}

.progress-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.progress-item {
  padding: 15px;
  background: #f8f8f8;
  border-radius: 6px;
}

.timestamps {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 0.9em;
}
</style>
