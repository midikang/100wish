import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WishDetailView from '../views/WishDetailView.vue'
import NewWishView from '../views/NewWishView.vue'
import LoginView from '../views/LoginView.vue'

/**
 * 路由配置数组
 * 定义了应用的所有路由规则
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { 
      title: '我的100个愿望' // 用于设置页面标题
    }
  },
  {
    path: '/wish/:id', // 动态路由参数，用于展示特定愿望的详情
    name: 'WishDetail',
    component: WishDetailView,
    meta: { 
      title: '愿望详情'
    }
  },
  {
    path: '/new',
    name: 'NewWish',
    component: NewWishView,
    meta: { 
      title: '新建愿望'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: '登录'
    }
  }
]

/**
 * 创建路由实例
 * 使用 HTML5 History 模式，可以创建干净的 URL（没有 # 号）
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局路由守卫
 * 在每次路由切换前执行
 * 用于动态设置页面标题
 */
router.beforeEach((to, _, next) => {
  document.title = `${to.meta.title} - 我的100个愿望计划`
  next()
})

// 路由守卫：未登录跳转到 /login
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

// axios 请求自动带 token
import axios from 'axios'
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default router
