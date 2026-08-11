import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Tag,
  User,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  Check,
} from 'lucide-react'

const ProductDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Order placement state
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [submittingOrder, setSubmittingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get(`/products/${id}`)
        if (res.data && res.data.success) {
          const p = res.data.data.product
          setProduct(p)
          if (p.quantity > 0) {
            setOrderQuantity(1)
          } else {
            setOrderQuantity(0)
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err)
        setError(err.response?.data?.message || 'Product not found or failed to load.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Pre-fill location if available on user
  useEffect(() => {
    if (user && user.location) {
      setCity(user.location)
    }
  }, [user])

  const handleIncrement = () => {
    if (product && orderQuantity < product.quantity) {
      setOrderQuantity((prev) => prev + 1)
    }
  }

  const handleDecrement = () => {
    if (orderQuantity > 1) {
      setOrderQuantity((prev) => prev - 1)
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setOrderError('')
    setOrderSuccess('')

    if (!user) {
      navigate('/login')
      return
    }

    if (user.role === 'FARMER') {
      setOrderError('Farmer accounts cannot place orders. Please register/login as a Buyer.')
      return
    }

    if (product.quantity <= 0) {
      setOrderError('Product is currently Out of Stock.')
      return
    }

    if (orderQuantity <= 0 || orderQuantity > product.quantity) {
      setOrderError(`Please select a valid quantity between 1 and ${product.quantity}.`)
      return
    }

    if (!street.trim() || !city.trim()) {
      setOrderError('Please provide a complete delivery street address and city.')
      return
    }

    const deliveryAddress = {
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      fullAddress: `${street.trim()}, ${city.trim()}, ${state.trim()} ${pincode.trim()}`.trim(),
    }

    try {
      setSubmittingOrder(true)
      // Send ONLY productId, quantity, and deliveryAddress
      const res = await api.post('/orders', {
        productId: product._id,
        quantity: orderQuantity,
        deliveryAddress,
      })

      if (res.data && res.data.success) {
        const createdOrder = res.data.data.order
        setOrderSuccess('Order placed successfully!')
        setTimeout(() => {
          navigate(`/orders/${createdOrder._id}`)
        }, 1200)
      }
    } catch (err) {
      console.error('Error placing order:', err)
      setOrderError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmittingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80 bg-slate-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded w-1/3"></div>
              <div className="h-20 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl shadow-sm border border-red-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-600 text-sm">{error || 'The requested product could not be found.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    )
  }

  const farmer = product.farmerId || {}
  const isVerified = product.isVerified || farmer.isVerified
  const isOutOfStock = product.quantity <= 0
  const estimatedTotal = (orderQuantity * product.price).toFixed(2)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        {/* Large Product Image */}
        <div className="relative rounded-xl overflow-hidden bg-slate-100 h-80 sm:h-96 w-full border border-slate-200">
          <img
            src={getProductImageUrl(product.image, product.name, product.category)}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = '/products/tomato.jpg'
            }}
          />

          <div className="absolute top-4 left-4">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          {isVerified && (
            <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <CheckCircle className="w-4 h-4" />
              <span>Verified Produce</span>
            </div>
          )}
        </div>

        {/* Product Details Content */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {product.category}
                </span>
                {product.qualityStatus && (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    Quality: {product.qualityStatus}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 mt-2">{product.name}</h1>
            </div>

            {/* Price & Quantity Stock Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Unit Price</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-emerald-700">₹{product.price}</span>
                  <span className="text-sm font-semibold text-slate-600">/ {product.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-slate-500 block">Inventory Status</span>
                {isOutOfStock ? (
                  <span className="text-sm font-extrabold text-red-600 bg-red-100 px-3 py-1 rounded-full inline-block mt-1">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-sm font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-flex items-center space-x-1 mt-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Available: {product.quantity} {product.unit}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Description
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Location */}
            {product.location && (
              <div className="flex items-center space-x-2 text-slate-600 text-sm">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Harvest Location: <strong className="text-slate-800">{product.location}</strong></span>
              </div>
            )}

            {/* Farmer Information Card */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Farmer Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{farmer.name || 'Local Farmer'}</span>
                </div>
                {farmer.phone && (
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{farmer.phone}</span>
                  </div>
                )}
                {farmer.email && (
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{farmer.email}</span>
                  </div>
                )}
                {farmer.location && (
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{farmer.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Checkout Form Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            {orderError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {orderSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{orderSuccess}</span>
              </div>
            )}

            {!user ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <p className="text-sm text-slate-600 font-medium">Log in to place orders directly with this farmer.</p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors shadow"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Login to Order</span>
                </Link>
              </div>
            ) : user.role === 'FARMER' ? (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800 text-xs text-center font-medium">
                You are logged in as a Farmer. Only buyer accounts can place orders.
              </div>
            ) : isOutOfStock ? (
              <button
                disabled
                className="w-full bg-slate-200 text-slate-500 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 text-base cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Out of Stock</span>
              </button>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Quantity</span>
                  <div className="flex items-center space-x-3 bg-white border border-slate-300 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={orderQuantity <= 1}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-extrabold text-slate-800 text-sm w-8 text-center">
                      {orderQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={orderQuantity >= product.quantity}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-500 pr-1">{product.unit}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500">Estimated Total:</span>
                  <span className="text-xl font-black text-emerald-700">₹{estimatedTotal}</span>
                </div>

                {/* Delivery Address Fields */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center space-x-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivery Address</span>
                  </span>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street / Farm Address / Door No. *"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    required
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City / District *"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                      required
                    />
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Pincode"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-md transition-colors disabled:opacity-50 mt-3"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{submittingOrder ? 'Processing Order...' : 'Place Order Now'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
