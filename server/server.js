import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db.js'
import notFound from './middleware/notFoundMiddleware.js'
import errorHandler from './middleware/errorMiddleware.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import priceInsightRoutes from './routes/priceInsightRoutes.js'
import verificationRoutes from './routes/verificationRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'

dotenv.config()

const app = express()

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  process.env.CLIENT_URL,
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null,
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (such as mobile apps, curl, Postman)
    if (!origin) return callback(null, true)

    if (
      allowedOrigins.includes(origin) ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('vercel.app') ||
      origin.includes('web.app') ||
      origin.includes('firebaseapp.com') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true)
    }

    return callback(new Error('Blocked by CORS policy'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1

  res.status(200).json({
    success: true,
    message: 'KisanConnect API is running',
    database: dbConnected ? 'connected' : 'disconnected',
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/price-insights', priceInsightRoutes)
app.use('/api/verifications', verificationRoutes)
app.use('/api/analytics', analyticsRoutes)

// 404 handler for unknown routes
app.use(notFound)

// Centralized error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// Connect to MongoDB, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`KisanConnect API running on port ${PORT}`)
  })
})