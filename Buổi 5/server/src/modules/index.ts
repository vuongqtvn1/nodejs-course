import { Router } from 'express'
import productModule from './product/product.module'
import authModule from './auth/auth.module'

const modules = Router()

modules.use('/', productModule)
modules.use('/', authModule)

export default modules
