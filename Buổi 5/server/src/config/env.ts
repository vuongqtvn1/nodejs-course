import dotenv from 'dotenv'

dotenv.config()

export const ConfigEnvironment = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URI || '',
  mongoDbName: process.env.MONGO_DB || '',
  jwtSecretKey: process.env.JWT_SECRET || '',
}
