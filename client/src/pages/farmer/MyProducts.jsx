import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import {
  PlusCircle,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle2,
  Tag,
  MapPin,
  ShieldCheck,
} from 'lucide-react'

const MyProducts = () => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Farm Produce</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, update, or verify your listed agricultural products</p>
        </div>
        <Link
          to="/farmer/products/add"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-colors shadow-md text-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Loading / Error / Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 animate-pulse space-y-3">
              <div className="h-40 bg-slate-200 rounded-lg"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchMyProducts}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <Package className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">No Listed Products Yet</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You haven't listed any farm produce on KisanConnect yet. Start listing products to reach thousands of buyers!
          </p>
          <Link
            to="/farmer/products/add"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            <span>List Your First Product</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100">
                  <img
                    src={getProductImageUrl(product.image, product.name, product.category)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/products/tomato.jpg'
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {product.isVerified && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{product.name}</h3>
                    <span className="text-lg font-extrabold text-emerald-700">₹{product.price}</span>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2">{product.description || 'No description provided.'}</p>

                  <div className="pt-2 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center">
                      <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                      <span>Quantity: <strong>{product.quantity} {product.unit}</strong></span>
                    </div>
                    {product.location && (
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" />
                        <span>Location: <strong>{product.location}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Delete Confirmation */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                {!product.isVerified && (
                  <div>
                    {verificationSuccessId === product._id ? (
                      <div className="text-[11px] bg-emerald-50 text-emerald-800 font-bold p-1.5 rounded text-center border border-emerald-200">
                        ✓ Verification Requested
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRequestVerification(product._id)}
                        disabled={verifyingId === product._id}
                        className="w-full inline-flex items-center justify-center space-x-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold py-1 px-2 rounded-lg text-xs transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>{verifyingId === product._id ? 'Requesting...' : 'Request Verification'}</span>
                      </button>
                    )}
                  </div>
                )}

                {deleteConfirmId === product._id ? (
                  <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-center space-y-2">
                    <p className="text-xs font-bold text-red-700">Delete this product?</p>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded transition-colors disabled:opacity-50"
                      >
                        {deletingId === product._id ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between space-x-2">
                    <Link
                      to={`/farmer/products/edit/${product._id}`}
                      className="flex-1 inline-flex items-center justify-center space-x-1 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => setDeleteConfirmId(product._id)}
                      className="flex-1 inline-flex items-center justify-center space-x-1 border border-red-200 text-red-600 hover:bg-red-50 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors"
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
