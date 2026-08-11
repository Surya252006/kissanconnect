import mongoose from 'mongoose'
import PriceInsight from '../models/PriceInsight.js'

// @desc    Get all price insights with search & filters
// @route   GET /api/price-insights
// @access  Public
export const getPriceInsights = async (req, res, next) => {
  try {
    const { search, category, location } = req.query
    const query = {}

    if (search && search.trim() !== '') {
      query.productName = new RegExp(search.trim(), 'i')
    }

    if (category && category.trim() !== '') {
      query.category = category.trim()
    }

    if (location && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i')
    }

    const insights = await PriceInsight.find(query).sort({ date: -1, createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Price insights fetched successfully',
      data: { insights },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single price insight by ID
// @route   GET /api/price-insights/:id
// @access  Public
export const getPriceInsightById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price insight ID format',
      })
    }

    const insight = await PriceInsight.findById(id)
    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Price insight not found',
      })
    }

    res.status(200).json({
      success: true,
      data: { insight },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create a new price insight
// @route   POST /api/price-insights
// @access  Private (ADMIN only)
export const createPriceInsight = async (req, res, next) => {
  try {
    const { productName, category, marketPrice, platformPrice, unit, location, trend, date } = req.body

    if (!productName || marketPrice === undefined || platformPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productName, marketPrice, and platformPrice',
      })
    }

    const mPrice = Number(marketPrice)
    const pPrice = Number(platformPrice)

    if (isNaN(mPrice) || mPrice < 0 || isNaN(pPrice) || pPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Market price and platform price must be non-negative numbers',
      })
    }

    const insight = await PriceInsight.create({
      productName: productName.trim(),
      category: category || 'Others',
      marketPrice: mPrice,
      platformPrice: pPrice,
      unit: unit || 'kg',
      location: location ? location.trim() : '',
      trend: trend || 'STABLE',
      date: date ? new Date(date) : new Date(),
    })

    res.status(201).json({
      success: true,
      message: 'Price insight created successfully',
      data: { insight },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update a price insight
// @route   PUT /api/price-insights/:id
// @access  Private (ADMIN only)
export const updatePriceInsight = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price insight ID format',
      })
    }

    const insight = await PriceInsight.findById(id)
    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Price insight not found',
      })
    }

    const updates = { ...req.body }
    if (updates.marketPrice !== undefined) {
      const mp = Number(updates.marketPrice)
      if (isNaN(mp) || mp < 0) {
        return res.status(400).json({ success: false, message: 'Market price must be non-negative' })
      }
      updates.marketPrice = mp
    }

    if (updates.platformPrice !== undefined) {
      const pp = Number(updates.platformPrice)
      if (isNaN(pp) || pp < 0) {
        return res.status(400).json({ success: false, message: 'Platform price must be non-negative' })
      }
      updates.platformPrice = pp
    }

    Object.assign(insight, updates)
    await insight.save()

    res.status(200).json({
      success: true,
      message: 'Price insight updated successfully',
      data: { insight },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a price insight
// @route   DELETE /api/price-insights/:id
// @access  Private (ADMIN only)
export const deletePriceInsight = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price insight ID format',
      })
    }

    const insight = await PriceInsight.findById(id)
    if (!insight) {
      return res.status(404).json({
        success: false,
        message: 'Price insight not found',
      })
    }

    await insight.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Price insight deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
