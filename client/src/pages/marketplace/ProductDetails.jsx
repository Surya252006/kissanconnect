import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api.js'
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
} from 'lucide-react'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get(`/products/${id}`)
        if (res.data && res.data.success) {
          setProduct(res.data.data.product)
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

            {/* Price & Quantity Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-xs font-medium text-slate-500 block">Unit Price</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-emerald-700">₹{product.price}</span>
                  <span className="text-sm font-semibold text-slate-600">/ {product.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-slate-500 block">Available Quantity</span>
                <span className="text-lg font-bold text-slate-800 flex items-center justify-end space-x-1">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>{product.quantity} {product.unit}</span>
                </span>
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

          {/* Place Order CTA Section */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <button
              disabled
              className="w-full bg-slate-300 text-slate-600 cursor-not-allowed font-bold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 text-base shadow-none"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Place Order (Coming next in Phase 4)</span>
            </button>
            <p className="text-center text-xs text-slate-400">
              Direct order placement & checkout capabilities will be unlocked in Phase 4.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
