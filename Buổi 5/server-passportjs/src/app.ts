import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import passport from 'passport'

import { connectDB } from './config/database'
import modules from './modules'
import { HttpResponse } from './utils/http-response'
import { logger } from './utils/logger'

const app = express()

connectDB()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(passport.initialize())

app.use('/api', modules)

// handler notfound
app.use('*', (req, res, next) => {
  next(HttpResponse.notFound('Không tìm thấy đường dẫn api này'))
})

// handler error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`)

  if (typeof err === 'object' && err['code']) {
    res.status(err['code']).json(err)
    return
  }

  res.status(500).json(HttpResponse.error(err.message))
})

export default app
