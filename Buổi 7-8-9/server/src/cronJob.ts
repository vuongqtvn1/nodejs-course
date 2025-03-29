import Redis from 'ioredis'
import cron from 'node-cron'
import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { logger } from './utils/logger'
import mongoose, { Schema } from 'mongoose'
import { connectDB } from './config/database'

connectDB()

const TrackingSchema = new Schema(
  {
    userId: { type: String, required: true },
    countViewer: { type: Number, required: true },
  },
  { timestamps: true }
)

export const TrackingModel = mongoose.model('Tracking', TrackingSchema)

const redis = new Redis()

const app = express()

app.get('/counting-viewer', async (req: Request, res: Response) => {
  const userId = req.query.userId as string
  const cachedCount = await redis.get(`counting:${userId}`)

  if (cachedCount) {
    console.log('redis caching')
    const newCount = Number(cachedCount) + 1
    await redis.set(`counting:${userId}`, newCount)
    res.status(StatusCodes.OK).json({ data: newCount })
    return
  }

  const tracking = await TrackingModel.findOne({ userId }).lean()

  let newCount = 0

  if (tracking) {
    newCount = tracking.countViewer + 1
    await redis.set(`counting:${userId}`, newCount)
  } else {
    newCount = 1
    await TrackingModel.create({ userId, countViewer: 1 })
  }

  // sau 24h minh se lay cai redis minh luu db lai va xoa cai key redis di hoc de lai nhu vay cungx duoc

  res.json({ data: newCount })
})

app.listen(5000, () => {
  logger.info(`🚀 Server is running on http://localhost:5000`)
})

// Tạo một cron job chạy mỗi phút
const task = cron.schedule('0 0 * * *', async () => {
  console.log('Cron job chạy mỗi phút:', new Date().toLocaleString())

  const keys = await redis.keys(`counting:*`)

  keys.forEach(async (key) => {
    const cachedCount = await redis.get(key)
    console.log(cachedCount, key)
    const userId = key.split(':')[1]
    if (cachedCount && userId) {
      // save db
      await TrackingModel.updateOne(
        { userId },
        { countViewer: Number(cachedCount) }
      )
    }
  })
})

const taskSayHello = cron.schedule('* * * * *', async () => {
  console.log('Hello Moi Nguoi')

  // const keys = await redis.keys(`counting:*`)

  // keys.forEach(async (key) => {
  //   const cachedCount = await redis.get(key)
  //   console.log(cachedCount, key)
  //   const userId = key.split(':')[1]
  //   if (cachedCount && userId) {
  //     // save db
  //     await TrackingModel.updateOne(
  //       { userId },
  //       { countViewer: Number(cachedCount) }
  //     )
  //   }
  // })
})

// Bắt đầu chạy cron job
task.start()
taskSayHello.start()
