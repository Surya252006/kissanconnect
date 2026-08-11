import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton.jsx'
import {
  ShoppingBag,
  Clock,
  Truck,
  Eye,
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Sparkles,
} from 'lucide-react'

export const MyOrders = () => {
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
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buyer Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">My Purchase Orders</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Track live dispatch status, delivery milestones, and direct farmer invoices.
          </p>
        </div>

        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-md hover:shadow-lg"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Marketplace</span>
        </Link>
      </div>

      {/* Loading / Error / Orders List */}
      {loading ? (
        <TableSkeleton rows={3} />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-bold">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow"
          >
            Retry Loading
          </button>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Produce Orders Yet"
          description="You haven't placed any direct produce orders yet. Explore our verified marketplace to source fresh crops directly from farmers."
          actionText="Explore Marketplace"
          actionLink="/marketplace"
        />
      ) : (
        <div className="space-y-6">
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
                className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden transition-all duration-200"
              >
                {/* Order Top Bar */}
                <div className="bg-slate-50 p-4 sm:p-5 border-b border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    <span className="flex items-center font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status:</span>
                    <StatusBadge status={order.status} />
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-2">Logistics:</span>
                    <StatusBadge status={order.logisticsStatus} />
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Item info */}
                  <div className="flex items-center space-x-5 md:col-span-2">
                    <img
                      src={getProductImageUrl(product.image, item.name, product.category)}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-2xl border border-slate-200 flex-shrink-0 shadow-inner"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/products/tomato.jpg'
                      }}
                    />
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-lg">{item.name}</h3>
                      <div className="text-xs text-slate-600 font-medium space-x-2">
                        <span>Quantity: <strong className="text-slate-900">{item.quantity} {item.unit}</strong></span>
                        <span>•</span>
                        <span>Unit Rate: <strong className="text-slate-900">₹{item.price}</strong></span>
                      </div>
                      <div className="flex items-center text-xs text-slate-600 pt-0.5">
                        <User className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                        <span>Producer: <strong className="text-slate-800">{farmer.name || 'Verified Farmer'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Total & Delivery Info */}
                  <div className="md:border-l border-slate-100 md:pl-6 space-y-1 text-left md:text-right">
                    <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Total Paid</span>
                    <span className="text-2xl font-black text-emerald-800">₹{order.totalAmount}</span>
                    {order.deliveryAddress && (
                      <p className="text-xs text-slate-500 truncate flex items-center justify-start md:justify-end font-medium">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        <span>{order.deliveryAddress.city || order.deliveryAddress.fullAddress}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {confirmCancelId === order._id ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-red-800">Cancel this order?</span>
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                        >
                          {cancellingId === order._id ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      order.status === 'PENDING' && (
                        <button
                          onClick={() => setConfirmCancelId(order._id)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel Order</span>
                        </button>
                      )
                    )}
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-black text-emerald-800 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>Live Tracking & Details</span>
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
