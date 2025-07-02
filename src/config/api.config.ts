// 基础 URL 配置
export const API_CONFIG = {
  development: 'http://localhost:3000/api',
 // production: 'https://100wish.midikang.com/api'
  production: 'http://100wish.midikang.com:3000/api'
}

// 获取当前环境的 API URL
export const getApiBaseUrl = () => {
  return import.meta.env.PROD ? API_CONFIG.production : API_CONFIG.development
}

// API 路径配置
export const API_PATHS = {
  wishes: '/wishes',
  sync: '/wishes/sync',
  auth: '/auth'
}

// 请求配置
export const REQUEST_CONFIG = {
  timeout: 10000,
  retryTimes: 3,
  retryDelay: 1000
}
