import { defineStore } from 'pinia';
import { type ThemeName, themes } from '../config/themes';

export const useThemeStore = defineStore('theme', {  state: () => ({
    currentTheme: 'google' as ThemeName
  }),

  actions: {
    setTheme(themeName: ThemeName) {
      this.currentTheme = themeName;
      this.applyTheme(themeName);
      localStorage.setItem('selectedTheme', themeName);
    },    applyTheme(themeName: ThemeName) {
      document.body.className = `theme-${themeName}`;
    },

    initTheme() {
      const savedTheme = localStorage.getItem('selectedTheme') as ThemeName;
      if (savedTheme && themes[savedTheme]) {
        this.setTheme(savedTheme);      } else {
        this.setTheme('google');
      }
    }
  },

  getters: {
    currentThemeConfig: (state) => themes[state.currentTheme]
  }
});
