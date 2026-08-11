import express from 'express'
import { getOverview } from '../controllers/analyticsController.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.use(protect)
router.use(authorizeRoles('ADMIN'))

router.get('/overview', getOverview)

export default router
