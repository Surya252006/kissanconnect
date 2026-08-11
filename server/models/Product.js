import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer is required'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others'],
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['kg', 'quintal', 'ton', 'piece', 'dozen'],
    },
    image: {
      type: String,
      trim: true,
    },
    imagePublicId: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    qualityStatus: {
      type: String,
      enum: ['Good', 'Average', 'Premium'],
      default: 'Good',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for common query patterns
productSchema.index({ farmerId: 1 })
productSchema.index({ category: 1 })
productSchema.index({ name: 1 })
productSchema.index({ location: 1 })

const Product = mongoose.model('Product', productSchema)

export default Product