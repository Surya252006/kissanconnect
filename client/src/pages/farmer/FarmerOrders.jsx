import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import { StatusBadge } from '../../components/ui/Badge.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton.jsx'
import {
  PackageCheck,
  User,
  MapPin,
  Clock,
  Truck,
  AlertCircle,
  Phone,
  Sparkles,
} from 'lucide-react'

const ORDER_STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
const LOGISTICS_STATUS_OPTIONS = ['PENDING', 'PACKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED']

export const FarmerOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const fetchFarmerOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/orders/farmer')
      if (res.data && res.data.success) {
        setOrders(res.data.data.orders || [])
      }
    } catch (err) {
      console.error('Error fetching farmer orders:', err)
      setError(err.response?.data?.message || 'Failed to load customer orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFarmerOrders()
  }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId)
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus })
      if (res.data && res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: res.data.data.order.status, logisticsStatus: res.data.data.order.logisticsStatus } : o))
        )
      }
    } catch (err) {
      console.error('Error updating order status:', err)
      alert(err.response?.data?.message || 'Failed to update order status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleUpdateLogistics = async (orderId, newLogistics) => {
    try {
      setUpdatingId(orderId)
      const res = await api.put(`/orders/${orderId}/logistics`, { logisticsStatus: newLogistics })
      if (res.data && res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, logisticsStatus: res.data.data.order.logisticsStatus, status: res.data.data.order.status } : o))
        )
      }
    } catch (err) {
      console.error('Error updating logistics status:', err)
      alert(err.response?.data?.message || 'Failed to update logistics status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fulfillment Center</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Customer Orders Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage incoming purchase orders, update shipping progress, and track deliveries.
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-900 px-4 py-2 rounded-2xl border border-emerald-200 text-xs font-black">
          {orders.length} Total Orders Received
        </div>
      </div>

      {/* Loading / Error / Orders List */}
      {loading ? (
        <TableSkeleton rows={4} />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-bold">{error}</p>
          <button
            onClick={fetchFarmerOrders}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow"
          >
            Retry Loading
          </button>
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={PackageCheck}
          title="No Customer Orders Received Yet"
          description="As soon as buyers, retailers, or wholesalers order your produce from the marketplace, their orders and delivery addresses will appear here."
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const item = order.items?.[0] || {}
            const product = item.productId || {}
            const buyer = order.buyerId || {}
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })

            const isCancelled = order.status === 'CANCELLED'

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

                {/* Body Content */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Produce details */}
                  <div className="lg:col-span-8 flex items-start space-x-5">
                    <img
                      src={getProductImageUrl(product.image, item.name, product.category)}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-2xl border border-slate-200 flex-shrink-0 shadow-inner"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/products/tomato.jpg'
                      }}
                    />
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-black text-slate-900 text-lg">{item.name}</h3>
                      <p className="text-xs text-slate-600 font-medium">
                        Order Qty: <strong className="text-slate-900">{item.quantity} {item.unit}</strong> @ ₹{item.price}/{item.unit}
                      </p>
                      <p className="text-base font-black text-emerald-800 pt-0.5">
                        Total Amount: ₹{order.totalAmount}
                      </p>

                      {/* Buyer Details */}
                      <div className="pt-2 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center font-bold text-slate-800">
                          <User className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                          <span>Buyer: {buyer.name || 'Customer'}</span>
                        </div>
                        {buyer.phone && (
                          <div className="flex items-center text-slate-600 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                            <span>{buyer.phone}</span>
                          </div>
                        )}
                        {order.deliveryAddress && (
                          <div className="flex items-center text-slate-600 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0" />
                            <span className="truncate">Deliver to: {order.deliveryAddress.fullAddress || order.deliveryAddress.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Management Controls */}
                  <div className="lg:col-span-4 bg-stone-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Fulfillment Controls
                    </h4>

                    {isCancelled ? (
                      <div className="p-3 bg-red-50 text-red-800 font-bold text-xs rounded-xl text-center border border-red-200">
                        Order Cancelled
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Order Status Selector */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Fulfillment Stage
                          </label>
                          <select
                            value={order.status}
                            disabled={updatingId === order._id || order.status === 'DELIVERED'}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 shadow-sm"
                          >
                            {ORDER_STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Logistics Status Selector */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center">
                            <Truck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                            <span>Logistics Progress</span>
                          </label>
                          <select
                            value={order.logisticsStatus}
                            disabled={updatingId === order._id || order.status === 'DELIVERED'}
                            onChange={(e) => handleUpdateLogistics(order._id, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 shadow-sm"
                          >
                            {LOGISTICS_STATUS_OPTIONS.map((lg) => (
                              <option key={lg} value={lg}>
                                {lg}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FarmerOrders
