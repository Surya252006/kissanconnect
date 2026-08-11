import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

// @desc    Get marketplace analytics overview
// @route   GET /api/analytics/overview
// @access  Private (ADMIN only)
export const getOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalConsumers,
      totalRetailers,
      totalWholesalers,
      totalProducts,
      verifiedProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      gmvResult,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'FARMER' }),
      User.countDocuments({ role: 'CONSUMER' }),
      User.countDocuments({ role: 'RETAILER' }),
      User.countDocuments({ role: 'WHOLESALER' }),
      Product.countDocuments(),
      Product.countDocuments({ isVerified: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'PENDING' }),
      Order.countDocuments({ status: 'CONFIRMED' }),
      Order.countDocuments({ status: 'DELIVERED' }),
      Order.countDocuments({ status: 'CANCELLED' }),
      Order.aggregate([
        { $match: { status: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find()
        .populate('buyerId', 'name email phone location')
        .populate('farmerId', 'name email phone location')
        .sort({ createdAt: -1 })
        .limit(10),
    ])

    const totalMarketplaceValue = gmvResult.length > 0 ? gmvResult[0].total : 0

    res.status(200).json({
      success: true,
      message: 'Analytics overview fetched successfully',
      data: {
        totalUsers,
        totalFarmers,
        totalConsumers,
        totalRetailers,
        totalWholesalers,
        totalProducts,
        verifiedProducts,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        cancelledOrders,
        totalMarketplaceValue,
        recentOrders,
      },
    })
  } catch (error) {
    next(error)
  }
}
