import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import { VerifiedBadge } from '../../components/ui/Badge.jsx'
import { PriceTransparencyCard } from '../../components/ui/PriceTransparencyCard.jsx'
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
  Sparkles,
  PackageCheck,
} from 'lucide-react'

const ProductDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [priceInsight, setPriceInsight] = useState(null)
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

          // Fetch benchmark price insight for this produce if available
          try {
            const piRes = await api.get(`/price-insights?search=${encodeURIComponent(p.name)}`)
            if (piRes.data && piRes.data.success && piRes.data.data.insights?.length > 0) {
              setPriceInsight(piRes.data.data.insights[0])
            }
          } catch (piErr) {
            // Non-critical, ignore
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

    const farmerIdStr = product.farmerId?._id ? product.farmerId._id.toString() : product.farmerId?.toString()
    if (farmerIdStr && farmerIdStr === user._id) {
      setOrderError('You cannot purchase your own listed produce.')
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
        setOrderSuccess('Order placed successfully! Redirecting to tracking...')
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
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/5 animate-pulse"></div>
        <div className="bg-white rounded-3xl p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="h-96 bg-slate-200 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-16 bg-slate-200 rounded-2xl"></div>
            <div className="h-32 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-sm border border-red-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Produce Not Found</h2>
        <p className="text-slate-600 text-sm">{error || 'The requested product listing could not be found.'}</p>
        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow"
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
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Back Button */}
      <div>
        <Link
          to="/marketplace"
          className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* Left Column: Image Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 h-80 sm:h-96 lg:h-[440px] w-full border border-slate-200 shadow-inner group">
            <img
              src={getProductImageUrl(product.image, product.name, product.category)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/products/tomato.jpg'
              }}
            />

            <div className="absolute top-4 left-4">
              <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {product.category}
              </span>
            </div>

            {isVerified && (
              <div className="absolute top-4 right-4">
                <VerifiedBadge isVerified={true} size="lg" />
              </div>
            )}
          </div>

          {/* Price Transparency Benchmark Component */}
          {priceInsight && (
            <PriceTransparencyCard
              marketPrice={priceInsight.marketPrice}
              platformPrice={product.price}
              unit={product.unit}
              location={priceInsight.location}
            />
          )}
        </div>

        {/* Right Column: Details & Checkout Form */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {product.category}
                </span>
                {product.qualityStatus && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Grade: {product.qualityStatus}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Stock Overview Box */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Direct Farm Price
                </span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-3xl font-black text-emerald-900">₹{product.price}</span>
                  <span className="text-sm font-bold text-slate-600">/ {product.unit}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Inventory Stock
                </span>
                {isOutOfStock ? (
                  <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full inline-block mt-1">
                    Out of Stock
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center space-x-1 mt-1">
                    <Tag className="w-3 h-3 text-emerald-700" />
                    <span>{product.quantity} {product.unit} available</span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Produce Description
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>
            )}

            {/* Location */}
            {product.location && (
              <div className="flex items-center space-x-2 text-slate-700 text-xs font-semibold bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Harvest Location: <strong>{product.location}</strong></span>
              </div>
            )}

            {/* Farmer Provenance Card */}
            <div className="bg-stone-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Producer Provenance</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{farmer.name || 'Local Verified Farmer'}</span>
                </div>
                {farmer.phone && (
                  <div className="flex items-center space-x-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{farmer.phone}</span>
                  </div>
                )}
                {farmer.location && (
                  <div className="flex items-center space-x-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{farmer.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Zero Middlemen Intermediaries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Checkout Form Section */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            {orderError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2 font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {orderSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-xl flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{orderSuccess}</span>
              </div>
            )}

            {!user ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                <p className="text-sm text-slate-600 font-semibold">
                  Sign in or create a buyer account to place direct orders.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Login to Order Produce</span>
                </Link>
              </div>
            ) : isOutOfStock ? (
              <button
                disabled
                className="w-full bg-slate-200 text-slate-500 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 text-sm cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Harvest Currently Out of Stock</span>
              </button>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Quantity ({product.unit})
                  </span>
                  <div className="flex items-center space-x-3 bg-white border border-slate-300 rounded-xl p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={orderQuantity <= 1}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-black text-slate-900 text-sm w-10 text-center">
                      {orderQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={orderQuantity >= product.quantity}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-40 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-semibold text-slate-500 pr-2">{product.unit}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount:</span>
                  <span className="text-2xl font-black text-emerald-800">₹{estimatedTotal}</span>
                </div>

                {/* Delivery Address Fields */}
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Delivery Address</span>
                  </span>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Street / Farm Address / Door No. *"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    required
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City / District *"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                      required
                    />
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Pincode"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 mt-3"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{submittingOrder ? 'Placing Order...' : 'Confirm & Place Order'}</span>
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
