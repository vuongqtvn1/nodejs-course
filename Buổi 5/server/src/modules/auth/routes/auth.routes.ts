import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { validate } from '~/middlewares/validate.middleware'
import { loginSchema, registerSchema } from '../validators/auth.validator'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = Router()

router.post('/register', validate(registerSchema), AuthController.register)
router.post('/login', validate(loginSchema), AuthController.login)
router.get('/getMe', authMiddleware, AuthController.getMe)

export default router
