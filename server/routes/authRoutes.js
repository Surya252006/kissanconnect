import express from 'express'
import {
  register,
  login,
  getMe,
  protectedTest,
  farmerTest,
  adminTest,
  buyerTest,
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)

// Private routes
router.get('/me', protect, getMe)

// --- Temporary development/test routes (remove before production) ---
router.get('/protected-test', protect, protectedTest)
router.get('/farmer-test', protect, authorizeRoles('FARMER'), farmerTest)
router.get('/admin-test', protect, authorizeRoles('ADMIN'), adminTest)
router.get('/buyer-test', protect, authorizeRoles('CONSUMER', 'RETAILER', 'WHOLESALER'), buyerTest)
// --------------------------------------------------------------------

export default router