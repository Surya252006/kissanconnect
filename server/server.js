import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db.js'
import notFound from './middleware/notFoundMiddleware.js'
import errorHandler from './middleware/errorMiddleware.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
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

// API routes (registered here as they are built in later phases)
// app.use('/api/users', userRoutes)
// app.use('/api/products', productRoutes)
// app.use('/api/orders', orderRoutes)

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