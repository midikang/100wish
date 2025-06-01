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
        <h1>我的100个愿望</h1>
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

<style scoped>
.app-nav {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  text-decoration: none;
  color: var(--color-primary);
}

.nav-brand h1 {
  font-size: 1.25rem;
  font-weight: bold;
}

.new-wish-btn {
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: background-color 0.3s;
}

.new-wish-btn:hover {
  background-color: var(--color-primary-dark);
}

@media (max-width: 640px) {
  .nav-content {
    padding: 0.75rem;
  }
  
  .nav-brand h1 {
    font-size: 1rem;
  }
  
  .new-wish-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
