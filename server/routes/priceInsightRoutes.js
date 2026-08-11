import express from 'express'
import {
  getPriceInsights,
  getPriceInsightById,
  createPriceInsight,
  updatePriceInsight,
  deletePriceInsight,
} from '../controllers/priceInsightController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

// Public read routes
router.get('/', getPriceInsights)
router.get('/:id', getPriceInsightById)

// Admin management routes
router.post('/', protect, authorizeRoles('ADMIN'), createPriceInsight)
router.put('/:id', protect, authorizeRoles('ADMIN'), updatePriceInsight)
router.delete('/:id', protect, authorizeRoles('ADMIN'), deletePriceInsight)

export default router
