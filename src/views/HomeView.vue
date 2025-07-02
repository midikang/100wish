<script setup lang="ts">
import { useWishStore } from '../stores/wishStore'
import WishCard from '../components/wishes/WishCard.vue'
import { computed, ref } from 'vue'

// 获取愿望清单的 store 实例
const wishStore = useWishStore()
const selectedStatus = ref('全部')
const loading = ref(true)
const deletingId = ref<number|null>(null)
const showDeleteConfirm = ref(false)

function onDeleteClick(id: number) {
  deletingId.value = id
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (deletingId.value != null) {
    await wishStore.deleteWish(deletingId.value)
    deletingId.value = null
    showDeleteConfirm.value = false
  }
}

function cancelDelete() {
  deletingId.value = null
  showDeleteConfirm.value = false
}

// 立即加载愿望列表
wishStore.loadWishes().finally(() => {
  loading.value = false
})

// 获取愿望列表
const wishes = computed(() => wishStore.wishes)

// 根据选中状态筛选愿望
const filteredWishes = computed(() => {
  if (selectedStatus.value === '全部') {
    return wishes.value
  }
  const statusMap = {
    '待开始': 'pending',
    '进行中': 'in-progress',
    '已完成': 'completed'
  }
  return wishes.value.filter(wish => wish.status === statusMap[selectedStatus.value as keyof typeof statusMap])
})
</script>

<template>
  <div class="home-view">
    <header class="page-header">
      <h1>我的愿望清单</h1>
      <button
        @click="$router.push('/new')"
        class="new-wish-btn"
      >
        创建新愿望
      </button>
    </header>

    <div class="wish-filters">
      <button 
        v-for="status in ['全部', '待开始', '进行中', '已完成']"
        :key="status"
        :class="['filter-btn', { active: selectedStatus === status }]"
        @click="selectedStatus = status"
      >
        {{ status }}
      </button>
    </div>

    <div class="grid-container">
      <div v-for="wish in filteredWishes" :key="wish.id" class="wish-card-item">
        <WishCard
          :wish="wish"
          @click="$router.push(`/wish/${wish.id}`)"
        />
        <button class="delete-btn" @click.stop="onDeleteClick(wish.id)">删除</button>
      </div>
    </div>

    <div v-if="wishes.length === 0" class="empty-state">
      <p>还没有添加任何愿望，点击右上角的"新建愿望"开始吧！</p>
    </div>

    <div v-if="showDeleteConfirm" class="delete-confirm-modal">
      <div class="modal-content">
        <p>确定要删除这个愿望吗？此操作不可撤销。</p>
        <button @click="confirmDelete()" class="confirm-btn">确认删除</button>
        <button @click="cancelDelete()" class="cancel-btn">取消</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
}

.new-wish-btn {
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: background-color 0.3s;
}

.new-wish-btn:hover {
  background-color: var(--color-primary-dark);
}

.wish-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  transition: all 0.3s;
}

.filter-btn.active {
  background-color: var(--color-primary);
  color: white;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.wish-card-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.wish-card-item:hover {
  transform: scale(1.05);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-gray-500);
}

.delete-btn {
  margin-top: 0.5rem;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #d9363e;
}

.delete-confirm-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.15);
  text-align: center;
}
.confirm-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  margin-right: 1rem;
  cursor: pointer;
}
.cancel-btn {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
}

@media (max-width: 640px) {
  .home-view {
    padding: 1rem;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .wish-filters {
    flex-wrap: wrap;
  }
}
</style>
