import mongoose from 'mongoose'
import Product from '../models/Product.js'
import { uploadToCloudinary } from '../config/cloudinary.js'

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (FARMER only)
export const createProduct = async (req, res, next) => {
  try {
    const { name, category, description, price, quantity, unit, location } = req.body

    // Validation for required fields
    if (!name || !category || !price || !quantity || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, category, price, quantity, unit',
      })
    }

    const numericPrice = Number(price)
    const numericQuantity = Number(quantity)

    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a non-negative number',
      })
    }

    if (isNaN(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a non-negative number',
      })
    }

    let imageUrl = req.body.image || ''
    let imagePublicId = ''

    // Handle Cloudinary/Multer image upload if a file was attached
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file)
      if (uploadResult) {
        imageUrl = uploadResult.url
        imagePublicId = uploadResult.public_id
      }
    }

    const product = await Product.create({
      farmerId: req.user._id,
      name,
      category,
      description,
      price: numericPrice,
      quantity: numericQuantity,
      unit,
      location: location || req.user.location || '',
      image: imageUrl,
      imagePublicId,
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all marketplace products (Search, Filter, Sort, Paginate)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, location, minPrice, maxPrice, sort, page, limit } = req.query

    const query = {}

    // Search case-insensitively across name, description, category, location
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i')
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { location: searchRegex },
      ]
    }

    // Filter by category
    if (category && category.trim() !== '') {
      query.category = category.trim()
    }

    // Filter by location
    if (location && location.trim() !== '') {
      query.location = new RegExp(location.trim(), 'i')
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined && minPrice !== '') {
        const parsedMin = Number(minPrice)
        if (!isNaN(parsedMin) && parsedMin >= 0) {
          query.price.$gte = parsedMin
        }
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        const parsedMax = Number(maxPrice)
        if (!isNaN(parsedMax) && parsedMax >= 0) {
          query.price.$lte = parsedMax
        }
      }
      if (Object.keys(query.price).length === 0) {
        delete query.price
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 } // default: newest
    if (sort === 'price_asc') {
      sortOptions = { price: 1 }
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 }
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    let limitNum = parseInt(limit, 10) || 12
    if (limitNum <= 0) limitNum = 12
    if (limitNum > 100) limitNum = 100 // Cap max limit

    const skip = (pageNum - 1) * limitNum

    const total = await Product.countDocuments(query)
    const pages = Math.ceil(total / limitNum) || 1

    const products = await Product.find(query)
      .populate('farmerId', 'name email phone location isVerified')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get logged in farmer's products
// @route   GET /api/products/my
// @access  Private (FARMER only)
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmerId: req.user._id })
      .populate('farmerId', 'name email phone location isVerified')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'My products fetched successfully',
      data: { products },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const product = await Product.findById(id).populate(
      'farmerId',
      'name email phone location isVerified'
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      data: { product },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (FARMER only - owner)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Ownership check
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this product',
      })
    }

    // Restricted fields MUST NOT be modified by farmer directly
    const updates = { ...req.body }
    delete updates.farmerId
    delete updates.isVerified
    delete updates.qualityStatus

    if (updates.price !== undefined) {
      const p = Number(updates.price)
      if (isNaN(p) || p < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a non-negative number',
        })
      }
      updates.price = p
    }

    if (updates.quantity !== undefined) {
      const q = Number(updates.quantity)
      if (isNaN(q) || q < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a non-negative number',
        })
      }
      updates.quantity = q
    }

    // Handle Cloudinary file upload if present
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file)
      if (uploadResult) {
        updates.image = uploadResult.url
        updates.imagePublicId = uploadResult.public_id
      }
    }

    Object.assign(product, updates)
    await product.save()

    const updatedProduct = await Product.findById(id).populate(
      'farmerId',
      'name email phone location isVerified'
    )

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (FARMER only - owner)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Ownership check
    if (product.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product',
      })
    }

    await product.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
