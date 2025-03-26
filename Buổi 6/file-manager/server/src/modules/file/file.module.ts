import fileRoutes from './routes/file.routes'
import { Router } from 'express'

const fileModule = Router()
fileModule.use('/files', fileRoutes)

export default fileModule
