<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToNewWish = () => {
  router.push('/new')
}
</script>

<template>
  <nav class="app-nav">
    <div class="nav-content">
      <router-link to="/" class="nav-brand">
        <h1 class="text-xl font-bold">我的100个愿望</h1>
      </router-link>

      <div class="nav-actions">
        <button
          @click="navigateToNewWish"
          class="new-wish-btn"
        >
          新建愿望
        </button>
      </div>
    </div>
  </nav>
</template>

<style>
.app-nav {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  color: #111827;
  transition: color 0.2s;
}

.nav-brand:hover {
  color: #374151;
}

.new-wish-btn {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.new-wish-btn:hover {
  background-color: #1d4ed8;
}

.new-wish-btn:focus {
  outline: none;
  ring: 2px;
  ring-offset: 2px;
  ring-color: #3b82f6;
}
</style>
