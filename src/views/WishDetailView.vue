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

// 进度更新表单数据
const progressForm = ref({
  current: '',
  next: '',
  percentage: 0
})

// 是否显示更新表单
const showUpdateForm = ref(false)

// 在组件挂载时获取愿望数据
onMounted(() => {
  const wishId = Number(route.params.id)
  const foundWish = wishStore.wishes.find(w => w.id === wishId)
  
  if (foundWish) {
    wish.value = foundWish
    console.log('当前愿望history:', foundWish.history)
  } else {
    // 如果找不到愿望，返回首页
    router.push('/')
  }
})

// 更新进度
const updateProgress = async () => {
  if (!wish.value) return
  
  try {
    console.log('开始更新进度, 当前 wish.history:', wish.value.history)
    await wishStore.updateProgress(wish.value.id, {
      current: progressForm.value.current,
      next: progressForm.value.next,
      percentage: progressForm.value.percentage
    })
    
    // 重新加载愿望数据
    const updatedWish = wishStore.wishes.find(w => w.id === wish.value?.id)
    if (updatedWish) {
      console.log('更新后 wish.history:', updatedWish.history)
      wish.value = updatedWish
    }
    
    // 重置表单
    showUpdateForm.value = false
    progressForm.value = {
      current: '',
      next: '',
      percentage: 0
    }
  } catch (error) {
    console.error('Failed to update progress:', error)
  }
}
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
        
        <div class="progress-section">
          <div class="progress-header">
            <h3>进展情况</h3>
            <button 
              class="update-btn"
              @click="showUpdateForm = !showUpdateForm"
            >
              {{ showUpdateForm ? '取消' : '更新进度' }}
            </button>
          </div>

          <div v-if="showUpdateForm" class="update-form">
            <div class="form-group">
              <label>当前进度</label>
              <textarea 
                v-model="progressForm.current"
                placeholder="描述当前完成的内容..."
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>下一步计划</label>
              <textarea 
                v-model="progressForm.next"
                placeholder="描述下一步的计划..."
                rows="3"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>完成度 ({{ progressForm.percentage }}%)</label>
              <input 
                type="range" 
                v-model.number="progressForm.percentage"
                min="0"
                max="100"
                step="5"
              >
            </div>
            
            <button 
              class="submit-btn"
              @click="updateProgress"
              :disabled="!progressForm.current"
            >
              提交更新
            </button>
          </div>

          <div v-else-if="wish.progress" class="progress-info">
            <p><strong>当前进度：</strong>{{ wish.progress.current }}</p>
            <p v-if="wish.progress.next"><strong>下一步：</strong>{{ wish.progress.next }}</p>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${wish.progress.percentage || 0}%` }"
              ></div>
            </div>
          </div>
          <div v-else class="empty-progress">
            <p>还没有更新进度，点击"更新进度"开始记录吧！</p>
          </div>
        </div>
      </div>

      <div class="rewards-section">
        <AchievementPanel :wish="wish" />
      </div>
    </div>

    <!-- 新增：历史记录展示 -->
    <div class="history-section">
      <h3>更新历史 ({{ wish.history?.length || 0 }} 条记录)</h3>
      <div v-if="!wish.history || wish.history.length === 0" class="no-history">
        暂无更新历史，进行一次进度更新后即可查看。
      </div>
      <ul v-else class="history-list">
        <li v-for="(item, idx) in wish.history" :key="idx" class="history-item">
          <div class="history-time">{{ new Date(item.time).toLocaleString() }}</div>
          <div class="history-desc">{{ item.desc }}</div>
          <pre class="history-data">{{ typeof item.data === 'object' ? JSON.stringify(item.data, null, 2) : item.data }}</pre>
        </li>
      </ul>
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

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.update-btn {
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.update-form {
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-gray-700);
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 80px;
}

.form-group input[type="range"] {
  width: 100%;
  margin-top: 0.5rem;
}

.submit-btn {
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.empty-progress {
  text-align: center;
  color: var(--color-gray-500);
  padding: 2rem 0;
}

.history-section {
  margin-top: 2.5rem;
  background: #f8f9fa;
  border-radius: var(--radius-md);
  padding: 1.5rem 2rem;
}
.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.history-item {
  border-bottom: 1px solid #eee;
  padding: 0.75rem 0;
}
.history-time {
  color: #888;
  font-size: 0.95rem;
}
.history-desc {
  font-weight: 500;
  margin: 0.2rem 0 0.3rem 0;
}
.history-data {
  background: #fff;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  color: #444;
  white-space: pre-wrap;
  margin: 0.2rem 0 0 0;
}
.no-history {
  text-align: center;
  color: #888;
  padding: 1rem 0;
  font-style: italic;
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
