import express from 'express'
import {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getProducts)

// Private FARMER routes (Must place /my before /:id)
router.get('/my', protect, authorizeRoles('FARMER'), getMyProducts)

router.get('/:id', getProductById)

router.post('/', protect, authorizeRoles('FARMER'), upload.single('image'), createProduct)

router.put('/:id', protect, authorizeRoles('FARMER'), upload.single('image'), updateProduct)

router.delete('/:id', protect, authorizeRoles('FARMER'), deleteProduct)

export default router
