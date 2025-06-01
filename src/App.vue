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
  @apply min-h-screen bg-gray-50;
}

.main-content {
  @apply container mx-auto px-4 py-6 sm:px-6 lg:px-8;
}
</style>
