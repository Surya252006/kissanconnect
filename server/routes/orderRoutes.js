import express from 'express'
import {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  getOrderById,
  updateOrderStatus,
  updateLogisticsStatus,
  cancelOrder,
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

// All order routes require authentication
router.use(protect)

// Order creation & buyer orders
router.post('/', createOrder)
router.get('/my', getMyOrders)

// Farmer specific order dashboard
router.get('/farmer', authorizeRoles('FARMER'), getFarmerOrders)

// Single Order detail route (placed after /my and /farmer)
router.get('/:id', getOrderById)

// Status & logistics updates (Farmer / Admin)
router.put('/:id/status', authorizeRoles('FARMER', 'ADMIN'), updateOrderStatus)
router.put('/:id/logistics', authorizeRoles('FARMER', 'ADMIN'), updateLogisticsStatus)

// Buyer order cancellation
router.put('/:id/cancel', cancelOrder)

export default router
