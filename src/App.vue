<script setup lang="ts">
import AppNav from './components/layout/AppNav.vue'
import { useThemeStore } from './stores/themeStore'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { currentTheme } = storeToRefs(themeStore)
</script>

<template>
  <div class="app" :class="`theme-${currentTheme}`">
    <AppNav />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  flex: 1;
}
@media (min-width: 640px) {
  .main-content {
    padding: 2rem;
  }
}
</style>
