import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/themeStore'

// 导入全局样式
import './styles/style.css'
import './styles/themes.css'
import { initializeDatabase } from './db/database'

const app = createApp(App)

// 使用 Pinia 状态管理
app.use(createPinia())

// 使用路由
app.use(router)

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

// 初始化数据库
initializeDatabase().then(() => {
  console.log('Database initialized successfully')
  app.mount('#app')
  console.log('Vue app mounted successfully')
}).catch(error => {
  console.error('Failed to initialize database:', error)
}) 