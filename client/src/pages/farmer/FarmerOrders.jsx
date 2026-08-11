import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import {
  PackageCheck,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Phone,
  Mail,
  ChevronDown,
} from 'lucide-react'

const ORDER_STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
const LOGISTICS_STATUS_OPTIONS = ['PENDING', 'PACKED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED']

const FarmerOrders = () => {
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Customer Orders Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Manage orders placed by buyers for your listed farm produce</p>
      </div>

      {/* Loading / Error / Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchFarmerOrders}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            Retry Loading
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <PackageCheck className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">No Customer Orders Received</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You don't have any customer orders at the moment. As soon as buyers place orders for your produce, they will appear here!
          </p>
        </div>
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
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden space-y-4"
              >
                {/* Header */}
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
                    <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
                    <span className="font-bold text-slate-800">{order.status}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Produce details */}
                  <div className="flex items-start space-x-4 md:col-span-2">
                    <img
                      src={getProductImageUrl(product.image, item.name, product.category)}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/products/tomato.jpg'
                      }}
                    />
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                      <p className="text-xs text-slate-600">
                        Ordered: <strong>{item.quantity} {item.unit}</strong> @ ₹{item.price}/{item.unit}
                      </p>
                      <p className="text-sm font-extrabold text-emerald-700 pt-1">
                        Total Order Amount: ₹{order.totalAmount}
                      </p>

                      {/* Buyer Details */}
                      <div className="pt-2 text-xs text-slate-600 space-y-1">
                        <div className="flex items-center font-semibold text-slate-800">
                          <User className="w-3.5 h-3.5 text-slate-400 mr-1" />
                          <span>Buyer: {buyer.name || 'Customer'}</span>
                        </div>
                        {buyer.phone && (
                          <div className="flex items-center text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400 mr-1" />
                            <span>{buyer.phone}</span>
                          </div>
                        )}
                        {order.deliveryAddress && (
                          <div className="flex items-center text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                            <span>Deliver to: {order.deliveryAddress.fullAddress || order.deliveryAddress.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Management Controls */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Update Order & Logistics
                    </h4>

                    {isCancelled ? (
                      <div className="p-3 bg-red-100 text-red-800 font-bold text-xs rounded-lg text-center">
                        Order Cancelled by Buyer
                      </div>
                    ) : (
                      <>
                        {/* Order Status Selector */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Order Status
                          </label>
                          <select
                            value={order.status}
                            disabled={updatingId === order._id || order.status === 'DELIVERED'}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
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
                            <Truck className="w-3 h-3 text-emerald-600 mr-1" />
                            <span>Logistics Stage</span>
                          </label>
                          <select
                            value={order.logisticsStatus}
                            disabled={updatingId === order._id || order.status === 'DELIVERED'}
                            onChange={(e) => handleUpdateLogistics(order._id, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                          >
                            {LOGISTICS_STATUS_OPTIONS.map((lg) => (
                              <option key={lg} value={lg}>
                                {lg}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
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
