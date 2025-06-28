import axios from 'axios'
import type { Wish } from '../types/wish'
import { getApiBaseUrl, API_PATHS } from '../config/api.config'

// 创建 axios 实例
const api = axios.create({
  // 使用统一配置的API地址
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 处理未授权的情况
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 错误重试配置
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

// 错误处理和重试逻辑
const handleRequestWithRetry = async (request: () => Promise<any>) => {
  let retries = 0
  
  while (retries < MAX_RETRIES) {
    try {
      return await request()
    } catch (error: any) {
      retries++
      console.log(`请求失败，第 ${retries} 次重试...`)
      
      if (retries === MAX_RETRIES) {
        throw new Error(
          error.response?.data?.message || 
          error.message || 
          '请求失败，请检查网络连接'
        )
      }
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries))
    }
  }
}

// API 方法
export const wishApi = {
  // 获取所有愿望
  async getAllWishes() {
    const { data } = await api.get<Wish[]>('/wishes')
    return data
  },

  // 获取单个愿望
  async getWish(id: number) {
    const { data } = await api.get<Wish>(`/wishes/${id}`)
    return data
  },

  // 创建新愿望
  async createWish(wish: Omit<Wish, 'id'>) {
    const { data } = await api.post<Wish>('/wishes', wish)
    return data
  },

  // 更新愿望
  async updateWish(id: number, wish: Partial<Wish>) {
    const { data } = await api.put<Wish>(`/wishes/${id}`, wish)
    return data
  },

  // 删除愿望
  async deleteWish(id: number) {
    await api.delete(`/wishes/${id}`)
  },

  // 同步愿望数据
  syncWishes: async (wishes: any[]) => {
    try {
      const response = await api.post(API_PATHS.sync, wishes)
      return response.data
    } catch (error: any) {
      console.error('同步失败:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        '同步失败，请检查网络连接'
      )
    }
  }
}

export default api
