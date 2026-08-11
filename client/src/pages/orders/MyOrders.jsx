import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  XCircle,
  AlertCircle,
  MapPin,
  User,
} from 'lucide-react'

const getStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Pending</span>
    case 'CONFIRMED':
      return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Confirmed</span>
    case 'PROCESSING':
      return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Processing</span>
    case 'SHIPPED':
      return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Shipped</span>
    case 'DELIVERED':
      return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Delivered</span>
    case 'CANCELLED':
      return <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full">Cancelled</span>
    default:
      return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{status}</span>
  }
}

const getLogisticsBadge = (logistics) => {
  switch (logistics) {
    case 'PENDING':
      return <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">Pending Pickup</span>
    case 'PACKED':
      return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-2 py-0.5 rounded">Packed</span>
    case 'PICKED_UP':
      return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold px-2 py-0.5 rounded">Picked Up</span>
    case 'IN_TRANSIT':
      return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold px-2 py-0.5 rounded">In Transit</span>
    case 'OUT_FOR_DELIVERY':
      return <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded">Out for Delivery</span>
    case 'DELIVERED':
      return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded">Delivered</span>
    default:
      return <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded">{logistics}</span>
  }
}

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)
  const [confirmCancelId, setConfirmCancelId] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/orders/my')
      if (res.data && res.data.success) {
        setOrders(res.data.data.orders || [])
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.response?.data?.message || 'Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId)
      const res = await api.put(`/orders/${orderId}/cancel`)
      if (res.data && res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: 'CANCELLED' } : o))
        )
        setConfirmCancelId(null)
      }
    } catch (err) {
      console.error('Error cancelling order:', err)
      alert(err.response?.data?.message || 'Failed to cancel order.')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track produce orders, delivery logistics, and purchase history</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors shadow"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Marketplace</span>
        </Link>
      </div>

      {/* Loading / Error / Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">No Orders Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You haven't placed any produce orders yet. Explore the marketplace to connect directly with local farmers.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow"
          >
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const item = order.items?.[0] || {}
            const product = item.productId || {}
            const farmer = order.farmerId || {}
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-emerald-300 transition-all"
              >
                {/* Order Card Top Bar */}
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-800">
                      Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(order.status)}
                    {getLogisticsBadge(order.logisticsStatus)}
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Item info */}
                  <div className="flex items-center space-x-4 md:col-span-2">
                    <img
                      src={getProductImageUrl(product.image, item.name, product.category)}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/products/tomato.jpg'
                      }}
                    />
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-800 text-base">{item.name}</h3>
                      <div className="text-xs text-slate-500 space-x-2">
                        <span>Quantity: <strong>{item.quantity} {item.unit}</strong></span>
                        <span>•</span>
                        <span>Unit Price: <strong>₹{item.price}</strong></span>
                      </div>
                      <div className="flex items-center text-xs text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-400 mr-1" />
                        <span>Farmer: <strong className="text-slate-700">{farmer.name || 'Farmer'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Total & Delivery Info */}
                  <div className="md:border-l border-slate-100 md:pl-4 space-y-1 text-right md:text-right">
                    <span className="text-xs text-slate-400 block font-medium">Total Amount</span>
                    <span className="text-xl font-extrabold text-emerald-700">₹{order.totalAmount}</span>
                    {order.deliveryAddress && (
                      <p className="text-[11px] text-slate-500 truncate flex items-center justify-end">
                        <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                        <span>{order.deliveryAddress.city || order.deliveryAddress.fullAddress}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {confirmCancelId === order._id ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-red-700">Confirm cancellation?</span>
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          {cancellingId === order._id ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1 rounded transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      order.status === 'PENDING' && (
                        <button
                          onClick={() => setConfirmCancelId(order._id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      )
                    )}
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Tracking & Details</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrders
