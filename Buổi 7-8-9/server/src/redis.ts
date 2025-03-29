import jwt from 'jsonwebtoken'
import express, { Request, Response } from 'express'
import Redis from 'ioredis'
import { logger } from './utils/logger'
import { StatusCodes } from 'http-status-codes'

const app = express()
const redis = new Redis()
const SECRET_KEY = 'your_secret_key'

// Đăng nhập và lưu token vào Redis
app.post('/login', async (req: Request, res: Response) => {
  const userId = '123'
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' })
  await redis.set(`jwt:${userId}`, token, 'EX', 3600)
  res.json({ token })
})

// Xác thực request
app.get('/protected', async (req: Request, res: Response) => {
  const token = req.headers.authorization
  const userId = '123'
  const cachedToken = await redis.get(`jwt:${userId}`)

  if (!cachedToken || cachedToken !== token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  res.json({ message: 'Authenticated' })
})

// Đăng xuất và thu hồi token
app.post('/logout', async (req, res) => {
  const userId = '123'
  await redis.del(`jwt:${userId}`)
  res.json({ message: 'Logged out' })
})

const getProductId = (id: string) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id, name: 'Laptop', price: 1200 })
    }, 2000)
  })

app.get('/product/:id', async (req: Request, res: Response) => {
  const productId = req.params.id
  const cachedProduct = await redis.get(`product:${productId}`)

  if (cachedProduct) {
    res.json(JSON.parse(cachedProduct))
    return
  }

  const product = await getProductId(productId)
  await redis.set(`product:${productId}`, JSON.stringify(product), 'EX', 300)
  res.json(product)
})

const pub = new Redis()

app.post('/add-product', async (req, res) => {
  const newProduct = { id: 3, name: 'Tablet' }
  await pub.publish('new_product', JSON.stringify(newProduct))
  // send mail
  // send ws
  // update bang categories
  res.json({ message: 'Product added' })
})

let count = 1

app.post('/buy-product', async (req, res) => {
  count += 1
  const newProduct = { id: count, name: 'Tablet' }
  await pub.publish('buy_product', JSON.stringify(newProduct))
  // send email
  // cap nhap so luogn san pham
  // tang so luong da ban
  // ...
  res.json({ message: 'Product buy', count })
})

app.get('/tracking', async (req: Request, res: Response) => {
  const userId = req.query.userId //  "student-1"
  const cachedUser = await redis.get(`tracking:${userId}`)

  if (cachedUser) {
    res
      .status(StatusCodes.TOO_MANY_REQUESTS)
      .json({ message: 'Vui long truy cap sau 1 giay' })
    return
  }

  await redis.set(`tracking:${userId}`, new Date().toISOString(), 'EX', 1)
  res.json({ data: 10 })
})

const dbUser: Record<string, number> = {
  'user-b': 0,
  'user-c': 10,
}

app.get('/counting-viewer', async (req: Request, res: Response) => {
  const userId = req.query.userId as string //  "student-1"
  const cachedCount = await redis.get(`counting:${userId}`)

  if (cachedCount) {
    console.log('redis caching')
    const newCount = Number(cachedCount) + 1
    await redis.set(`counting:${userId}`, newCount)
    res.status(StatusCodes.OK).json({ data: newCount })
    return
  }

  const newCount = dbUser[userId] + 1 // lay du lieu trong db
  // sau 24h minh se lay cai redis minh luu db lai va xoa cai key redis di hoc de lai nhu vay cungx duoc

  console.log('db query')
  await redis.set(`counting:${userId}`, newCount)
  res.json({ data: newCount })
})

app.listen(5000, () => {
  logger.info(`🚀 Server is running on http://localhost:5000`)
})
