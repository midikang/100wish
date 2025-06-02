import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    // server: {
    //   fs: {
    //     allow: ['.'], // 允许访问项目根目录下的文件
    //   },
    // },
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
    },
    base: '/', // 直接部署在域名根目录下
    // 使用 Hostwinds 的反向代理配置
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
