import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'

import { connectDB } from './config/database'
import './config/passport'
import modules from './modules'
import { HttpResponse } from './utils/http-response'
import logger from './utils/logger'

const app = express()

connectDB()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', modules)

// handler notfound
app.use('*', (req, res, next) => {
  console.log(req.url)
  next(HttpResponse.notFound('Không tìm thấy api nay'))
})

// handler error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`)
  res.status(500).json(HttpResponse.error(err.message))
})

export default app
