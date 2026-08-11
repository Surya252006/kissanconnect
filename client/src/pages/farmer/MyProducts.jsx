import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import { VerifiedBadge } from '../../components/ui/Badge.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { ProductSkeleton } from '../../components/ui/LoadingSkeleton.jsx'
import {
  PlusCircle,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  Tag,
  MapPin,
  ShieldCheck,
  PackageCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react'

export const MyProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [verifyingId, setVerifyingId] = useState(null)
  const [verificationSuccessId, setVerificationSuccessId] = useState(null)

  const fetchMyProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/products/my')
      if (res.data && res.data.success) {
        setProducts(res.data.data.products || [])
      }
    } catch (err) {
      console.error('Error fetching farmer products:', err)
      setError(err.response?.data?.message || 'Failed to load your products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)
      const res = await api.delete(`/products/${id}`)
      if (res.data && res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id))
        setDeleteConfirmId(null)
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      alert(err.response?.data?.message || 'Failed to delete product.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRequestVerification = async (productId) => {
    try {
      setVerifyingId(productId)
      const res = await api.post('/verifications', {
        type: 'PRODUCT',
        productId,
        remarks: 'Farmer requested produce quality verification',
      })
      if (res.data && res.data.success) {
        setVerificationSuccessId(productId)
        setTimeout(() => setVerificationSuccessId(null), 3000)
      }
    } catch (err) {
      console.error('Error requesting verification:', err)
      alert(err.response?.data?.message || 'Failed to submit verification request.')
    } finally {
      setVerifyingId(null)
    }
  }

  // Calculate Farmer Summary Metrics
  const totalListings = products.length
  const totalStock = products.reduce((acc, p) => acc + (p.quantity || 0), 0)
  const verifiedCount = products.filter((p) => p.isVerified).length

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farmer Producer Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">My Farm Produce</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage inventory, update direct prices, or request quality verifications for your crops.
          </p>
        </div>

        <Link
          to="/farmer/products/add"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg text-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Add New Produce</span>
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Active Produce Listings"
          value={totalListings}
          subtitle="Listed on marketplace"
          icon={Package}
          color="emerald"
        />
        <StatCard
          title="Total Available Stock"
          value={totalStock}
          subtitle="Combined harvest units"
          icon={Tag}
          color="amber"
        />
        <StatCard
          title="Verified Listings"
          value={`${verifiedCount} / ${totalListings}`}
          subtitle="Quality certified crops"
          icon={ShieldCheck}
          color="purple"
        />
      </div>

      {/* Loading / Error / Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-bold">{error}</p>
          <button
            onClick={fetchMyProducts}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow"
          >
            Retry Loading
          </button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No Farm Produce Listed Yet"
          description="You have not published any crop or harvest listings yet. List your harvest to reach consumers, retailers, and wholesalers directly."
          actionText="List Your First Harvest"
          actionLink="/farmer/products/add"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={getProductImageUrl(product.image, product.name, product.category)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/products/tomato.jpg'
                    }}
                  />
                  <div className="absolute top-3.5 left-3.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  {product.isVerified && (
                    <div className="absolute top-3.5 right-3.5">
                      <VerifiedBadge isVerified={true} size="sm" />
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black text-slate-900 line-clamp-1">{product.name}</h3>
                    <span className="text-xl font-black text-emerald-800">₹{product.price} <span className="text-xs font-normal text-slate-500">/{product.unit}</span></span>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2 font-medium leading-relaxed">
                    {product.description || 'Direct farm harvest listing.'}
                  </p>

                  <div className="pt-2 text-xs text-slate-600 space-y-1.5 border-t border-slate-100">
                    <div className="flex items-center font-medium">
                      <Tag className="w-3.5 h-3.5 text-amber-500 mr-1.5 flex-shrink-0" />
                      <span>Stock: <strong className="text-slate-800">{product.quantity} {product.unit}</strong></span>
                    </div>
                    {product.location && (
                      <div className="flex items-center font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0" />
                        <span className="truncate">{product.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Verification Controls */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2 rounded-b-3xl">
                {!product.isVerified && (
                  <div>
                    {verificationSuccessId === product._id ? (
                      <div className="text-xs bg-emerald-50 text-emerald-900 font-bold p-2 rounded-xl text-center border border-emerald-200">
                        ✓ Verification Requested
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRequestVerification(product._id)}
                        disabled={verifyingId === product._id}
                        className="w-full inline-flex items-center justify-center space-x-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold py-2 px-3 rounded-xl text-xs transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                        <span>{verifyingId === product._id ? 'Submitting...' : 'Request Quality Verification'}</span>
                      </button>
                    )}
                  </div>
                )}

                {deleteConfirmId === product._id ? (
                  <div className="bg-red-50 p-3 rounded-2xl border border-red-200 text-center space-y-2">
                    <p className="text-xs font-bold text-red-800">Permanently delete this crop listing?</p>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                      >
                        {deletingId === product._id ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between space-x-2">
                    <Link
                      to={`/farmer/products/edit/${product._id}`}
                      className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-sm"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => setDeleteConfirmId(product._id)}
                      className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProducts
