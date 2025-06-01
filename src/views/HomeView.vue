<script setup lang="ts">
import { useWishStore } from '../stores/wishStore'
import WishCard from '../components/wishes/WishCard.vue'
import { computed } from 'vue'

// 获取愿望清单的 store 实例
const wishStore = useWishStore()

const wishes = computed(() => wishStore.wishes)
</script>

<template>
  <div class="home-view">
    <div class="grid-container">
      <WishCard
        v-for="wish in wishes"
        :key="wish.id"
        :wish="wish"
        @click="$router.push(`/wish/${wish.id}`)"
        class="cursor-pointer"
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
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

.empty-state {
  margin-top: 3rem;
  padding: 3rem 0;
}
</style>
