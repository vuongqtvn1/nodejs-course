import { Router } from 'express'

import productRoutes from './routes/auth.routes'

const authModule = Router()

authModule.use('/auth', productRoutes)

export default authModule
