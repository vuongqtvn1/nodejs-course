// potb woqn wtyu smcn
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import { connectDB } from './config/database'
import { i18nClient } from './i18n'
import { logger } from './utils/logger'
import { HttpResponse } from './utils/http-response'

const app = express()

app.use(express.json())

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'quocvuongta1032@gmail.com',
    pass: 'potb woqn wtyu smcn',
  },
})

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(payload: {
  to: string
  subject: string
  html: string
}) {
  try {
    const { html, subject, to } = payload
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'Hello guy! <quocvuongta1032@gmail.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    })

    console.log('Message sent: %s', info.messageId)
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  } catch (error) {
    console.log(error, payload)
  }
}

connectDB()

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
})

const OtpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  otpExpires: Date,
})

const UserModel = mongoose.model('User', UserSchema)
const OtpModel = mongoose.model('Otp', OtpSchema)

app.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    })

    const otpExpires = new Date(Date.now() + 10 * 60000)

    await OtpModel.findOneAndUpdate(
      { email },
      { otp, otpExpires },
      { upsert: true, new: true }
    )

    const htmlTemplate = `<h1>Xác thực OTP</h1><p>Mã OTP của bạn là: <b>{{otp}}</b></p>`
    const emailContent = htmlTemplate.replace(/{{otp}}/g, otp)

    const mailOptions = {
      to: email,
      subject: 'Mã OTP đăng ký',
      html: emailContent,
    }

    await sendEmail(mailOptions)
    res.json({ message: 'OTP đã được gửi' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi gửi email', error })
  }
})

app.post('/register', async (req, res) => {
  const { email, password, otp } = req.body
  const user = await UserModel.findOne({ email })
  const otpEmail = await OtpModel.findOne({ email })

  if (user) {
    res.status(400).json({ message: 'User da ton tai' })
    return
  }

  if (
    !otpEmail ||
    otpEmail.otp !== otp ||
    new Date(String(otpEmail.otpExpires)) < new Date()
  ) {
    res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' })
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await UserModel.create({
    email,
    password: hashedPassword,
  })

  await OtpModel.deleteOne({ email })

  res.json({ message: 'Đăng ký thành công' })
})

app.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body
    const resetToken = crypto.randomBytes(32).toString('hex')

    await OtpModel.findOneAndUpdate(
      { email },
      { otp: resetToken, otpExpires: new Date(Date.now() + 15 * 60000) },
      { upsert: true, new: true }
    )

    const htmlTemplate = `<h1 style="color: red;">Đặt lại mật khẩu</h1><p>Bấm vào <a href="https://yourapp.com/reset?token={{token}}">đây</a> để đặt lại mật khẩu.</p>`
    const emailContent = htmlTemplate.replace(/{{token}}/g, resetToken)

    const mailOptions = {
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: emailContent,
    }

    await sendEmail(mailOptions)
    res.status(200).json({ message: 'ok' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi gửi email', error })
  }
})

app.post('/confirm-reset', async (req, res) => {
  const { email, token, newPassword } = req.body
  const user = await UserModel.findOne({ email })
  const otpEmail = await OtpModel.findOne({ email })

  if (
    !user ||
    !otpEmail ||
    otpEmail.otp !== token ||
    new Date(String(otpEmail.otpExpires)) < new Date()
  ) {
    res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })

    return
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await UserModel.updateOne({ email }, { password: hashedPassword })

  res.json({ message: 'Mật khẩu đã được đặt lại' })
})

// cron.schedule('0 8 * * *', () => {
//   const mailOptions = {
//     to: 'quocvuongta1023@gmail.com',
//     subject: 'Chao buoi sang',
//     html: '<h1>Hello buoi sang vui ve</h1>',
//   }

//   sendEmail(mailOptions)
// })

// cron.schedule('* * * * *', async () => {
//   await OtpModel.deleteMany({ otpExpires: { $lt: new Date() } })
// })

app.use(i18nClient.init)

app.get('/', (req, res) => {
  res.setLocale('en')
  res.send(res.__('welcome'))
})

app.get('/greet', (req, res) => {
  throw HttpResponse.error({ message: 'invalid-data' })
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const lang = req.headers['accept-language'] === 'en' ? 'en' : 'vi'

  console.log(lang, req.headers['accept-language'])
  res.setLocale(lang)

  if (error?.message) {
    res.send({ ...error, message: res.__(error?.message) })
  }
})

app.listen(5000, () => {
  logger.info(`🚀 Server is running on http://localhost:5000`)
})
