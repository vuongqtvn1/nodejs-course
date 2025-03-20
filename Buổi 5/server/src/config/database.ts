import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = 'mongodb://localhost:27017/test_db'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error)
    process.exit(1)
  }
}
