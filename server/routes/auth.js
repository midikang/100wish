import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()
const SECRET = 'your-very-secret-key'

// 从 .env 或配置文件读取账号
import dotenv from 'dotenv'
dotenv.config()
const users = [
  {
    username: process.env.ADMIN_USER || 'admin',
    password: process.env.ADMIN_PASS || '123456'
  }
]

// 登录接口
router.post('/login', (req, res) => {
  const { username, password } = req.body
  console.log('/login', username, password);


  const user = users.find(u => u.username === username && u.password === password)
  if (!user) return res.status(401).json({ message: '用户名或密码错误' })
  const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' })
  res.json({ token })
})

// 鉴权中间件
export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: '未登录' })
  const token = auth.slice(7)
  try {
    const payload = jwt.verify(token, SECRET)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ message: '登录已过期，请重新登录' })
  }
}

export default router
