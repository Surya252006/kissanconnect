import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

// @desc    Create a new order (Buyer only)
// @route   POST /api/orders
// @access  Private (CONSUMER/RETAILER/WHOLESALER/ADMIN)
export const createOrder = async (req, res, next) => {
  try {
    // Security Check: FARMER role cannot place orders as buyers
    if (req.user.role === 'FARMER') {
      return res.status(403).json({
        success: false,
        message: 'Farmers are not authorized to create buyer orders',
      })
    }

    const { productId, quantity, deliveryAddress } = req.body

    // 1. Basic validation
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid product ID',
      })
    }

    const requestedQty = Number(quantity)
    if (isNaN(requestedQty) || requestedQty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0',
      })
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a delivery address',
      })
    }

    // Standardize delivery address
    let formattedAddress = {}
    if (typeof deliveryAddress === 'string') {
      formattedAddress = {
        fullAddress: deliveryAddress,
        street: deliveryAddress,
        city: req.user.location || '',
        state: '',
        pincode: '',
      }
    } else if (typeof deliveryAddress === 'object') {
      formattedAddress = {
        street: deliveryAddress.street || deliveryAddress.fullAddress || '',
        city: deliveryAddress.city || '',
        state: deliveryAddress.state || '',
        pincode: deliveryAddress.pincode || '',
        fullAddress:
          deliveryAddress.fullAddress ||
          `${deliveryAddress.street || ''}, ${deliveryAddress.city || ''}, ${deliveryAddress.state || ''} ${deliveryAddress.pincode || ''}`.trim(),
      }
    }

    // 2. Retrieve Product from MongoDB & check initial stock
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    if (product.quantity < requestedQty) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient product quantity',
      })
    }

    // 3. Atomic inventory reduction in MongoDB
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, quantity: { $gte: requestedQty } },
      { $inc: { quantity: -requestedQty } },
      { new: true }
    )

    if (!updatedProduct) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient product quantity',
      })
    }

    // 4. Calculate total amount on backend using trusted product price
    const unitPrice = updatedProduct.price
    const totalAmount = requestedQty * unitPrice

    // 5. Create Order
    const order = await Order.create({
      buyerId: req.user._id,
      farmerId: updatedProduct.farmerId,
      items: [
        {
          productId: updatedProduct._id,
          name: updatedProduct.name,
          quantity: requestedQty,
          price: unitPrice,
          unit: updatedProduct.unit,
        },
      ],
      totalAmount,
      deliveryAddress: formattedAddress,
      status: 'PENDING',
      logisticsStatus: 'PENDING',
    })

    const populatedOrder = await Order.findById(order._id)
      .populate('farmerId', 'name email phone location isVerified')
      .populate('buyerId', 'name email phone location')
      .populate('items.productId', 'name image category')

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: populatedOrder },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get logged-in buyer's orders
// @route   GET /api/orders/my
// @access  Private (Buyer)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('farmerId', 'name email phone location isVerified')
      .populate('items.productId', 'name image category')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: { orders },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get orders for logged-in farmer's produce
// @route   GET /api/orders/farmer
// @access  Private (FARMER only)
export const getFarmerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ farmerId: req.user._id })
      .populate('buyerId', 'name email phone location')
      .populate('items.productId', 'name image category')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Farmer orders fetched successfully',
      data: { orders },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private (Buyer, Farmer of order, or Admin)
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      })
    }

    const order = await Order.findById(id)
      .populate('farmerId', 'name email phone location isVerified')
      .populate('buyerId', 'name email phone location')
      .populate('items.productId', 'name image category description location')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Security check: Only buyer, farmer of this order, or ADMIN can view
    const isBuyer = order.buyerId._id.toString() === req.user._id.toString()
    const isFarmer = order.farmerId._id.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'ADMIN'

    if (!isBuyer && !isFarmer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order',
      })
    }

    res.status(200).json({
      success: true,
      data: { order },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (FARMER of order, or ADMIN)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      })
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    const normalizedStatus = status ? status.toUpperCase() : ''

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
      })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Security check: Only farmer of this order or ADMIN can update status
    const isFarmer = order.farmerId.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'ADMIN'

    if (!isFarmer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this order',
      })
    }

    // Transition validation
    if (order.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled orders cannot be modified',
      })
    }

    if (order.status === 'DELIVERED' && normalizedStatus !== 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Delivered orders cannot be reverted to a previous status',
      })
    }

    order.status = normalizedStatus

    // If marked delivered, update logistics status to DELIVERED as well
    if (normalizedStatus === 'DELIVERED') {
      order.logisticsStatus = 'DELIVERED'
    }

    await order.save()

    const updatedOrder = await Order.findById(id)
      .populate('farmerId', 'name email phone location isVerified')
      .populate('buyerId', 'name email phone location')

    res.status(200).json({
      success: true,
      message: `Order status updated to ${normalizedStatus}`,
      data: { order: updatedOrder },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update logistics status
// @route   PUT /api/orders/:id/logistics
// @access  Private (FARMER of order, or ADMIN)
export const updateLogisticsStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { logisticsStatus } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      })
    }

    const validLogistics = ['PENDING', 'PACKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED']
    const normalizedLogistics = logisticsStatus ? logisticsStatus.toUpperCase() : ''

    if (!validLogistics.includes(normalizedLogistics)) {
      return res.status(400).json({
        success: false,
        message: `Invalid logistics status. Allowed values: ${validLogistics.join(', ')}`,
      })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Security check: Only farmer of this order or ADMIN can update logistics
    const isFarmer = order.farmerId.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'ADMIN'

    if (!isFarmer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update logistics for this order',
      })
    }

    if (order.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled orders cannot update logistics status',
      })
    }

    order.logisticsStatus = normalizedLogistics

    // Auto-update order status if logistics reaches DELIVERED
    if (normalizedLogistics === 'DELIVERED') {
      order.status = 'DELIVERED'
    }

    await order.save()

    const updatedOrder = await Order.findById(id)
      .populate('farmerId', 'name email phone location isVerified')
      .populate('buyerId', 'name email phone location')

    res.status(200).json({
      success: true,
      message: `Logistics status updated to ${normalizedLogistics}`,
      data: { order: updatedOrder },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel an order & restore inventory (Buyer only)
// @route   PUT /api/orders/:id/cancel
// @access  Private (Buyer of order)
export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Security check: Only buyer who placed order can cancel it
    const isBuyer = order.buyerId.toString() === req.user._id.toString()
    if (!isBuyer) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this order',
      })
    }

    // Check if already cancelled
    if (order.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      })
    }

    // Check if cancellation allowed (only before SHIPPED / DELIVERED)
    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled after shipment or delivery',
      })
    }

    // Mark order as CANCELLED
    order.status = 'CANCELLED'
    await order.save()

    // Restore product stock in MongoDB (only once)
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: item.quantity },
      })
    }

    const updatedOrder = await Order.findById(id)
      .populate('farmerId', 'name email phone location isVerified')
      .populate('buyerId', 'name email phone location')

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully and inventory restored',
      data: { order: updatedOrder },
    })
  } catch (error) {
    next(error)
  }
}
