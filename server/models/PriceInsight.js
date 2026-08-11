import mongoose from 'mongoose'

const priceInsightSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others'],
      default: 'Others',
    },
    marketPrice: {
      type: Number,
      required: [true, 'Market price is required'],
      min: [0, 'Market price cannot be negative'],
    },
    platformPrice: {
      type: Number,
      required: [true, 'Platform price is required'],
      min: [0, 'Platform price cannot be negative'],
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'piece', 'dozen'],
      default: 'kg',
    },
    location: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    trend: {
      type: String,
      enum: ['UP', 'DOWN', 'STABLE'],
      default: 'STABLE',
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for common price-insight query patterns: by product, by location, by date
priceInsightSchema.index({ productName: 1 })
priceInsightSchema.index({ location: 1 })
priceInsightSchema.index({ date: 1 })

const PriceInsight = mongoose.model('PriceInsight', priceInsightSchema)

export default PriceInsight