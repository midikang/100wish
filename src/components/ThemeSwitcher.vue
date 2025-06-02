<template>
  <div class="theme-switcher">
    <button 
      v-for="theme in themes" 
      :key="theme.name"
      class="theme-button"
      :class="{ active: currentTheme === theme.name }"
      @click="setTheme(theme.name)"
    >
      <div class="theme-preview" :style="getThemePreviewStyle(theme)"></div>
      <span>{{ theme.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/themeStore';
import { themes, type Theme, type ThemeName } from '../config/themes';
import { storeToRefs } from 'pinia';

const themeStore = useThemeStore();
const { currentTheme } = storeToRefs(themeStore);

const setTheme = (themeName: ThemeName) => {
  themeStore.setTheme(themeName);
};

const getThemePreviewStyle = (theme: Theme) => {
  return {
    background: theme.colors.background,
    backgroundImage: `${theme.colors.pattern}, ${theme.colors.background}`,
    borderColor: theme.colors.border,
    boxShadow: '0 2px 8px ' + theme.colors.border
  };
};
</script>

<style scoped>
.theme-switcher {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #eee;
}

.theme-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-button:hover {
  transform: translateY(-2px);
}

.theme-button:hover .theme-preview {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-button.active .theme-preview {
  border-width: 2px;
  border-color: var(--highlight);
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.theme-preview {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-attachment: fixed;
}

.theme-button span {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.theme-button:hover span {
  opacity: 1;
}

.theme-button.active span {
  color: var(--highlight);
  opacity: 1;
}
</style>
