import mongoose from 'mongoose'
import Verification from '../models/Verification.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

// @desc    Submit a verification request (Product or User)
// @route   POST /api/verifications
// @access  Private
export const createVerificationRequest = async (req, res, next) => {
  try {
    const { type, productId, remarks } = req.body

    if (!type || !['USER', 'PRODUCT'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Verification type must be either USER or PRODUCT',
      })
    }

    let targetProductId = null
    let targetUserId = req.user._id

    if (type === 'PRODUCT') {
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Valid productId is required for PRODUCT verification',
        })
      }

      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        })
      }

      // Check ownership if caller is farmer
      if (req.user.role === 'FARMER' && product.farmerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only request verification for your own products',
        })
      }

      targetProductId = product._id
      targetUserId = product.farmerId
    }

    const verification = await Verification.create({
      userId: targetUserId,
      productId: targetProductId,
      type,
      remarks: remarks || '',
      status: 'PENDING',
    })

    const populated = await Verification.findById(verification._id)
      .populate('userId', 'name email phone role location')
      .populate('productId', 'name category price location')

    res.status(201).json({
      success: true,
      message: 'Verification request submitted successfully',
      data: { verification: populated },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get verification requests
// @route   GET /api/verifications
// @access  Private (ADMIN or user's own)
export const getVerificationRequests = async (req, res, next) => {
  try {
    const query = {}
    if (req.user.role !== 'ADMIN') {
      query.userId = req.user._id
    }

    const verifications = await Verification.find(query)
      .populate('userId', 'name email phone role location isVerified')
      .populate('productId', 'name category price location isVerified')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Verification requests fetched successfully',
      data: { verifications },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get verification request by ID
// @route   GET /api/verifications/:id
// @access  Private
export const getVerificationById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification ID format',
      })
    }

    const verification = await Verification.findById(id)
      .populate('userId', 'name email phone role location isVerified')
      .populate('productId', 'name category price location isVerified')
      .populate('verifiedBy', 'name email')

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found',
      })
    }

    // Access check
    const isOwner = verification.userId?._id.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this verification request',
      })
    }

    res.status(200).json({
      success: true,
      data: { verification },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Approve verification request (ADMIN only)
// @route   PUT /api/verifications/:id/approve
// @access  Private (ADMIN only)
export const approveVerification = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification ID format',
      })
    }

    const verification = await Verification.findById(id)
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found',
      })
    }

    verification.status = 'VERIFIED'
    verification.verifiedBy = req.user._id
    if (req.body.remarks) {
      verification.remarks = req.body.remarks
    }

    await verification.save()

    // Synchronize underlying entity
    if (verification.type === 'PRODUCT' && verification.productId) {
      await Product.findByIdAndUpdate(verification.productId, { isVerified: true })
    } else if (verification.type === 'USER' && verification.userId) {
      await User.findByIdAndUpdate(verification.userId, { isVerified: true })
    }

    const updated = await Verification.findById(id)
      .populate('userId', 'name email phone isVerified')
      .populate('productId', 'name category price isVerified')
      .populate('verifiedBy', 'name email')

    res.status(200).json({
      success: true,
      message: 'Verification approved successfully',
      data: { verification: updated },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Reject verification request (ADMIN only)
// @route   PUT /api/verifications/:id/reject
// @access  Private (ADMIN only)
export const rejectVerification = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification ID format',
      })
    }

    const verification = await Verification.findById(id)
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Verification request not found',
      })
    }

    verification.status = 'REJECTED'
    verification.verifiedBy = req.user._id
    if (req.body.remarks) {
      verification.remarks = req.body.remarks
    }

    await verification.save()

    // Synchronize underlying entity
    if (verification.type === 'PRODUCT' && verification.productId) {
      await Product.findByIdAndUpdate(verification.productId, { isVerified: false })
    } else if (verification.type === 'USER' && verification.userId) {
      await User.findByIdAndUpdate(verification.userId, { isVerified: false })
    }

    const updated = await Verification.findById(id)
      .populate('userId', 'name email phone isVerified')
      .populate('productId', 'name category price isVerified')
      .populate('verifiedBy', 'name email')

    res.status(200).json({
      success: true,
      message: 'Verification rejected successfully',
      data: { verification: updated },
    })
  } catch (error) {
    next(error)
  }
}
