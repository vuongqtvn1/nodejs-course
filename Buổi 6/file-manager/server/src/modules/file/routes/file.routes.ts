import { Router } from 'express'
import { uploadLocal } from '~/middlewares/multer'
import { validate } from '~/middlewares/validate'
import { FileController } from '../controllers/file.controller'
import {
  createFolderSchema,
  renameFileSchema,
} from '../validators/file.validator'

const router = Router()

router.get('/download/:id', FileController.downloadFile)
router.post('/file', uploadLocal.single('file'), FileController.uploadFile)
router.post(
  '/folder',
  validate(createFolderSchema),
  FileController.createFolder
)
router.get('/', FileController.getAllFile)
router.put('/:type/:id', validate(renameFileSchema), FileController.renameFile)
router.delete('/:type/:id', FileController.deleteFile)

export default router
