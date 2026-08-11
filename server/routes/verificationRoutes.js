import express from 'express'
import {
  createVerificationRequest,
  getVerificationRequests,
  getVerificationById,
  approveVerification,
  rejectVerification,
} from '../controllers/verificationController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(protect)

router.post('/', createVerificationRequest)
router.get('/', getVerificationRequests)
router.get('/:id', getVerificationById)

router.put('/:id/approve', authorizeRoles('ADMIN'), approveVerification)
router.put('/:id/reject', authorizeRoles('ADMIN'), rejectVerification)

export default router
