<script setup lang="ts">
import AppNav from './components/layout/AppNav.vue'
</script>

<template>
  <div class="app">
    <AppNav />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background-color: var(--color-gray-50);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

@media (min-width: 640px) {
  .main-content {
    padding: 2rem;
  }
}
</style>
