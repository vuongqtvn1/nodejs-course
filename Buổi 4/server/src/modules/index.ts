import { Router } from 'express'
import productModule from './product/product.module'

const modules = Router()

modules.use('/', productModule)

export default modules
