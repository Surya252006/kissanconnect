import mongoose from 'mongoose'

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    type: {
      type: String,
      required: [true, 'Verification type is required'],
      enum: ['USER', 'PRODUCT'],
    },
    status: {
      type: String,
      required: [true, 'Verification status is required'],
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for querying verification records by user or product
verificationSchema.index({ userId: 1 })
verificationSchema.index({ productId: 1 })
verificationSchema.index({ status: 1 })

const Verification = mongoose.model('Verification', verificationSchema)

export default Verification