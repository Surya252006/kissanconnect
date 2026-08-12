import express from 'express'
import { handleAIChat } from '../controllers/chatController.js'
import { optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /api/chat
router.post('/', optionalAuth, handleAIChat)

export default router
