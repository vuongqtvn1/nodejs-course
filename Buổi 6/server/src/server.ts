import app from './app'
import { ConfigEnvironment } from './config/env'
import { logger } from './utils/logger'

import './cloudinary'

const PORT = ConfigEnvironment.port

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`)
})
