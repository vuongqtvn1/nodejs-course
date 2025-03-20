import app from './app'
import { ConfigEnvironment } from './config/env'

const PORT = ConfigEnvironment.port

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})
