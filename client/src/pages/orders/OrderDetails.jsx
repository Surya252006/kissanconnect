import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  AlertCircle,
  XCircle,
  Tag,
  Check,
} from 'lucide-react'

const ORDER_STEPS = [
  { key: 'PENDING', label: 'Order Placed' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
]

const LOGISTICS_STEPS = [
  { key: 'PACKED', label: 'Packed' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'IN_TRANSIT', label: 'In Transit' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
]

const OrderDetails = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get(`/orders/${id}`)
        if (res.data && res.data.success) {
          setOrder(res.data.data.order)
        }
      } catch (err) {
        console.error('Error fetching order details:', err)
        setError(err.response?.data?.message || 'Order not found or access denied.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl shadow-sm border border-red-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-slate-600 text-sm">{error || 'Unable to view this order.'}</p>
        <Link
          to="/my-orders"
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    )
  }

  const item = order.items?.[0] || {}
  const product = item.productId || {}
  const farmer = order.farmerId || {}
  const buyer = order.buyerId || {}

  const currentOrderStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.status)
  const currentLogisticsStepIndex = LOGISTICS_STEPS.findIndex((s) => s.key === order.logisticsStatus)
  const isCancelled = order.status === 'CANCELLED'

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link
          to="/my-orders"
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {order._id}</span>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-800">
                Order #{order._id.substring(order._id.length - 8).toUpperCase()}
              </h1>
              {isCancelled && (
                <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancelled</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>Placed on {formattedDate}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Total Amount Paid</span>
            <span className="text-3xl font-black text-emerald-700">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Visual Order Progress Timeline */}
        {!isCancelled ? (
          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center space-x-1">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Order Status Progress</span>
              </h3>

              <div className="relative flex items-center justify-between">
                {ORDER_STEPS.map((step, idx) => {
                  const isDone = idx <= currentOrderStepIndex
                  const isCurrent = idx === currentOrderStepIndex

                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110 shadow'
                            : isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-semibold mt-2 text-center ${
                          isCurrent ? 'text-emerald-700 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Visual Logistics Timeline */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center space-x-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Logistics Timeline</span>
              </h3>

              <div className="relative flex items-center justify-between">
                {LOGISTICS_STEPS.map((step, idx) => {
                  const isDone = currentLogisticsStepIndex >= 0 && idx <= currentLogisticsStepIndex
                  const isCurrent = idx === currentLogisticsStepIndex

                  return (
                    <div key={step.key} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110 shadow'
                            : isDone
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[10px] font-semibold mt-2 text-center ${
                          isCurrent ? 'text-indigo-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-800 space-y-1">
            <h4 className="font-bold text-sm flex items-center space-x-1">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>This order was cancelled</span>
            </h4>
            <p className="text-xs text-red-600">
              The order has been cancelled and the product quantity was restored to the farmer's inventory.
            </p>
          </div>
        )}

        {/* Product Details Section */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ordered Produce</h3>

          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <img
              src={getProductImageUrl(product.image, item.name, product.category)}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-xl border border-slate-300"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/products/tomato.jpg'
              }}
            />
            <div className="flex-1 space-y-1">
              <h4 className="text-lg font-bold text-slate-800">{item.name}</h4>
              <div className="text-xs text-slate-500 space-x-2">
                <span>Quantity: <strong className="text-slate-800">{item.quantity} {item.unit}</strong></span>
                <span>•</span>
                <span>Unit Price: <strong className="text-slate-800">₹{item.price}</strong></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
              <span className="text-xl font-bold text-emerald-700">₹{item.quantity * item.price}</span>
            </div>
          </div>
        </div>

        {/* Details Grid: Farmer Info & Delivery Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
          {/* Farmer Details */}
          <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
            <h4 className="font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Farmer Contact</span>
            </h4>
            <p className="font-bold text-slate-800 text-sm">{farmer.name || 'Local Farmer'}</p>
            {farmer.phone && (
              <p className="flex items-center text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span>{farmer.phone}</span>
              </p>
            )}
            {farmer.email && (
              <p className="flex items-center text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span>{farmer.email}</span>
              </p>
            )}
            {farmer.location && (
              <p className="flex items-center text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <span>{farmer.location}</span>
              </p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Delivery Address</span>
            </h4>
            {order.deliveryAddress ? (
              <div className="text-slate-700 space-y-0.5">
                <p className="font-semibold text-slate-800">{order.deliveryAddress.street || buyer.name}</p>
                <p>{order.deliveryAddress.city}{order.deliveryAddress.state ? `, ${order.deliveryAddress.state}` : ''} {order.deliveryAddress.pincode}</p>
                {order.deliveryAddress.fullAddress && (
                  <p className="text-slate-500 text-[11px] pt-1">{order.deliveryAddress.fullAddress}</p>
                )}
              </div>
            ) : (
              <p className="text-slate-500">No delivery address provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
