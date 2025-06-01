import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    fs: {
      allow: ['.'], // 允许访问项目根目录下的文件
    },
  },
  // 如果是 SSR 应用
  ssr: {
    external: ['sqlite3']
  },
  plugins: [vue()],
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: 'assets', // 静态资源目录
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
    
  }
})
