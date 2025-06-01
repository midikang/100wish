<script setup lang="ts">
import { useWishStore } from '../stores/wishStore'
import WishCard from '../components/wishes/WishCard.vue'
import { computed, ref } from 'vue'

// 获取愿望清单的 store 实例
const wishStore = useWishStore()
const selectedStatus = ref('全部')

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
        @click="$router.push('/wish/new')"
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
      <WishCard
        v-for="wish in filteredWishes"
        :key="wish.id"
        :wish="wish"
        @click="$router.push(`/wish/${wish.id}`)"
        class="cursor-pointer hover:transform hover:scale-105 transition-transform"
      />
    </div>

    <div v-if="wishes.length === 0" class="empty-state">
      <p class="text-gray-500 text-center">
        还没有添加任何愿望，点击右上角的"新建愿望"开始吧！
      </p>
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
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
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
