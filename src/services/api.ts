import axios from 'axios'
import type { Wish } from '../types/wish'

// 创建 axios 实例
const api = axios.create({
  // 在生产环境中替换为实际的API地址
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
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
  async syncWishes(wishes: Wish[]) {
    const { data } = await api.post<Wish[]>('/wishes/sync', wishes)
    return data
  }
}

export default api
