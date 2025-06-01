<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWishStore } from '../stores/wishStore'
//import type { Wish } from '../types/wish'

const router = useRouter()
const wishStore = useWishStore()

const title = ref('')
const description = ref('')
const currentProgress = ref('')
const futurePlan = ref('')

const submitForm = () => {
  const newWish = {
    title: title.value,
    description: description.value,
    status: 'pending',
    ...(currentProgress.value || futurePlan.value
      ? {
          progress: {
            current: currentProgress.value,
            future: futurePlan.value,
          },
        }
      : {}),
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
  }

  wishStore.addWish(newWish)
  router.push('/')
}
</script>

<template>
  <div class="new-wish-view">
    <h1 class="page-title">新建愿望</h1>

    <form @submit.prevent="submitForm" class="wish-form">
      <div class="form-group">
        <label for="title" class="label">愿望标题</label>
        <input
          id="title"
          v-model="title"
          type="text"
          required
          class="input"
          placeholder="输入你的愿望标题"
        >
      </div>

      <div class="form-group">
        <label for="description" class="label">详细描述</label>
        <textarea
          id="description"
          v-model="description"
          required
          class="input min-h-[120px]"
          placeholder="详细描述你的愿望"
        /></div>

      <div class="form-group">
        <label for="currentProgress" class="label">当前进展（可选）</label>
        <textarea
          id="currentProgress"
          v-model="currentProgress"
          class="input"
          placeholder="描述当前的进展情况"
        />
      </div>

      <div class="form-group">
        <label for="futurePlan" class="label">未来计划（可选）</label>
        <textarea
          id="futurePlan"
          v-model="futurePlan"
          class="input"
          placeholder="描述未来的计划"
        />
      </div>

      <div class="form-actions">
        <button type="button" @click="router.back()" class="btn-secondary">
          取消
        </button>
        <button type="submit" class="btn-primary">
          保存愿望
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.new-wish-view {
  @apply max-w-2xl mx-auto px-4 py-8;
}

.page-title {
  @apply mb-8 text-center;
}

.wish-form {
  @apply space-y-6;
}

.form-group {
  @apply space-y-1;
}

.form-actions {
  @apply flex justify-end space-x-4 mt-8;
}
</style>
