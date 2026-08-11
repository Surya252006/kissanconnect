import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'KisanConnect API is running',
  })
})

// Connect to MongoDB if MONGO_URI exists
const MONGO_URI = process.env.MONGO_URI

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err.message))
} else {
  console.log('MONGO_URI not set — skipping MongoDB connection')
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`KisanConnect API running on port ${PORT}`)
})