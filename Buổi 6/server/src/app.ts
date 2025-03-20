import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import multer from 'multer'
import passport from 'passport'
import path from 'path'

import { connectDB } from './config/database'
import './middlewares/passport'
import modules from './modules'
import { logger } from './utils/logger'
import { HttpResponse } from './utils/http-response'

const app = express()

connectDB()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(passport.initialize())
// Phục vụ các file trong thư mục "public" tại đường dẫn "/public"
app.use('/public', express.static(path.join(__dirname, 'public')))
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

// const data = fs.readFileSync(path.join(__dirname, 'hello.txt'))
// stream

// console.log(data)

// fs.readFile(path.join(__dirname, 'hello.txt'), 'utf8', (err, data) => {
//   if (err) {
//     console.error('Lỗi khi đọc file:', err)
//     return
//   }
//   // stream => text
//   console.log('Nội dung file:', data)
// })

// const newData = 'Hello, Node.js! Đây là nội dung mới của file.'
// fs.writeFile(path.join(__dirname, 'hello.txt'), newData, 'utf8', (err) => {
//   if (err) {
//     console.error('Lỗi khi ghi file:', err)
//     return
//   }
//   console.log('File đã được ghi thành công!')
// })

// fs.unlink(path.join(__dirname, 'hello1.txt'), (err) => {
//   if (err) {
//     console.error('Lỗi khi xóa file:', err)
//     return
//   }
//   console.log('File đã được xóa thành công!')
// })

// fs.rmdir(path.join(__dirname, 'temp'), (err) => {
//   if (err) {
//     console.error('Lỗi khi xóa Folder:', err)
//     return
//   }
//   console.log('Folder đã được xóa thành công!')
// })

// fs.rename(
//   path.join(__dirname, 'hello.txt'),
//   path.join(__dirname, 'nodejs.txt'),
//   (err) => {
//     if (err) {
//       console.error('Lỗi khi xóa rename file:', err)
//       return
//     }
//     console.log('Rename file thành công!')
//   }
// )

// const isExist = fs.existsSync(path.join(__dirname, 'hello.txt'))
// console.log(isExist)

// if (!isExist) {
//   fs.writeFile(
//     path.join(__dirname, 'hello.txt'),
//     'FIle nay moi duoc tao',
//     (err) => {
//       if (err) {
//         console.error(err)
//       } else {
//         // file written successfully
//       }
//     }
//   )
// }

// __dirname = ./src

// console.log(path.extname(path.join(__dirname, 'hello.txt')))

// .png .jpg .jepg

// Multer

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, 'public'),
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
//     cb(null, uniqueSuffix + path.extname(file.originalname))
//   },
// })

// const upload = multer({
//   // dest: path.join(__dirname, 'public'),
//   limits: {
//     fieldNameSize: 255,
//     fileSize: 5 * 1024 * 1024,
//     fieldSize: 5,
//   },
//   fileFilter(req, file, callback) {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       callback(null, true)
//     } else {
//       const error = new Error('Chỉ cho phép upload ảnh JPEG hoặc PNG!')
//       callback(error)
//     }
//   },
//   storage,
// })

// 1kb = 1024bit
// 1mb = 1024kb

// 5 = 5 * 1024kb

// const upload1 = multer({ limits: { fileSize: 0 } }).single('avatar')

// app.post('/profile', function (req, res, next) {
//   upload1(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       console.log(err)
//       // A Multer error occurred when uploading.
//     } else if (err) {
//       // An unknown error occurred when uploading.
//     }

//     if (err) next(err)

//     res.json('OK')

//     // Everything went fine.
//   })
// })

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
//   console.log(req.file)
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any

//   res.json(req.file)
// })

// app.post('/photos', upload.array('photos', 2), function (req, res, next) {
//   // req.files is array of `photos` files
//   // req.body will contain the text fields, if there were any
//   console.log(req.files)

//   res.json(req.files)
// })

// const cpUpload = upload.fields([
//   { name: 'avatar', maxCount: 1 },
//   { name: 'photos', maxCount: 2 },
// ])

// app.post('/cool-profile', cpUpload, function (req, res, next) {
//   // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
//   //
//   // e.g.
//   //  req.files['avatar'][0] -> File
//   //  req.files['gallery'] -> Array
//   //
//   // req.body will contain the text fields, if there were any
// })

// // handler error
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof multer.MulterError) {
//     // A Multer error occurred when uploading.
//     res.json({ message: 'Upload Multer Error', error: err })
//     return
//   }

//   logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`)

//   if (typeof err === 'object' && err['code']) {
//     res.status(err['code']).json(err)
//     return
//   }

//   res.status(500).json(HttpResponse.error(err.message))
// })
export default app
