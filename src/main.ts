import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 导入全局样式
import './styles/style.css'
import { initializeDatabase } from './db/database'


const app = createApp(App)

// 使用 Pinia 状态管理
app.use(createPinia())

// 使用路由
app.use(router)

// 初始化数据库
initializeDatabase().then(() => {
  // 如果数据库初始化成功，挂载 Vue 应用
  console.log('Database initialized successfully')
  // 挂载 Vue 应用
  console.log('挂载 Vue 应用...')
  app.mount('#app')
  console.log('挂载 Vue 应用 成功')

}).catch(error => {
  console.error('Failed to initialize database:', error)
}) 