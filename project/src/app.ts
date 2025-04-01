import compression from 'compression'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import passport from 'passport'

import { connectDB } from './config/database'
import { logger } from './config/logger'
import './middlewares/passport'
import modules from './modules'
import { HttpResponse } from './utils/http-response'
import i18nClient from './i18n'
import { AppError } from './utils/app-error'
import { StatusCodes } from 'http-status-codes'

const app = express()

connectDB()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(compression())
app.use(i18nClient.init)
app.use(passport.initialize())

app.use('/api', modules)

// handler notfound
app.use(/(.*)/, (req, res, next) => {
  throw new AppError({
    id: 'app.middleware',
    message: 'API_NOTFOUND',
    statusCode: StatusCodes.NOT_FOUND,
  })
})

// handler error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const language = req.headers['accept-language'] === 'en' ? 'en' : 'vi'

  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`)

  if (err instanceof AppError) {
    err.translate(language)

    res.status(err.statusCode).json(err)
    return
  } else {
    const error = new AppError({
      id: 'app.middleware',
      message: 'INTERNAL_SERVER_ERROR',
      detail: err.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    })

    error.translate(language)
    res.status(error.statusCode).json(error)
  }
})

export default app
