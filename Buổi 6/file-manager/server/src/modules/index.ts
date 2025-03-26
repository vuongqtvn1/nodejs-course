import { Router } from 'express'

import authModule from './auth/auth.module'
import productModule from './product/product.module'
import fileModule from './file/file.module'

const modules = Router()

modules.use('/', productModule)
modules.use('/', authModule)
modules.use('/', fileModule)

export default modules
