import mongoose from 'mongoose'

/**
 * Connect to MongoDB using MONGO_URI from environment variables.
 * Exits the process safely if the connection fails.
 */
const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI

  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in environment variables')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(MONGO_URI)
    console.log(`MongoDB connected successfully: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB