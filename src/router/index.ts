import { createRouter, createWebHistory } from 'vue-router'

/**
 * 路由配置数组
 * 定义了应用的所有路由规则
 */
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'), // 使用动态导入实现路由懒加载
    meta: { 
      title: '我的100个愿望' // 用于设置页面标题
    }
  },
  {
    path: '/wish/:id', // 动态路由参数，用于展示特定愿望的详情
    name: 'WishDetail',
    component: () => import('../views/WishDetailView.vue'),
    meta: { 
      title: '愿望详情'
    }
  },
  {
    path: '/new',
    name: 'NewWish',
    component: () => import('../views/NewWishView.vue'),
    meta: { 
      title: '新建愿望'
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

export default router
