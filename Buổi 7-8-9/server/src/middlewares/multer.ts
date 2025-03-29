import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import multer from 'multer'
import path from 'path'

import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { ConfigEnvironment } from '~/config/env'
import { FileService } from '~/modules/file/services/file.service'
import { HttpResponse } from '~/utils/http-response'

const storageLocal = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const { folder } = req.body

      let directory = ConfigEnvironment.uploadFolder

      if (folder) {
        const existFolder = await FileService.getFolderById(folder)

        if (!existFolder) {
          throw HttpResponse.notFound('Folder not found')
        }

        directory = existFolder.url
      }

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
      }

      req.headers['directory'] = directory

      cb(null, directory)
    } catch (error: any) {
      cb(error, '')
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const storageCloud = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'drive' } as any,
})

const uploadLocal = multer({ storage: storageLocal })
const uploadCloud = multer({ storage: storageCloud })

export { uploadCloud, uploadLocal }
