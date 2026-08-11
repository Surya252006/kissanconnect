import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import { ArrowLeft, Edit, AlertCircle, Upload, CheckCircle } from 'lucide-react'

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others']
const UNITS = ['kg', 'quintal', 'ton', 'piece', 'dozen']

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Vegetables')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [location, setLocation] = useState('')
  const [currentImage, setCurrentImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreset, setImagePreset] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get(`/products/${id}`)
        if (res.data && res.data.success) {
          const p = res.data.data.product
          setName(p.name || '')
          setCategory(p.category || 'Vegetables')
          setDescription(p.description || '')
          setPrice(p.price !== undefined ? String(p.price) : '')
          setQuantity(p.quantity !== undefined ? String(p.quantity) : '')
          setUnit(p.unit || 'kg')
          setLocation(p.location || '')
          setCurrentImage(p.image || '')
        }
      } catch (err) {
        console.error('Error fetching product for edit:', err)
        setError(err.response?.data?.message || 'Product not found.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Form Validation Rules (Target 3.13)
    if (!name.trim()) {
      setError('Product name is required.')
      return
    }
    if (!category) {
      setError('Category is required.')
      return
    }
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) {
      setError('Price must be a valid number greater than or equal to 0.')
      return
    }
    if (quantity === '' || isNaN(Number(quantity)) || Number(quantity) < 0) {
      setError('Quantity must be a valid number greater than or equal to 0.')
      return
    }
    if (!unit) {
      setError('Unit is required.')
      return
    }

    try {
      setSubmitting(true)

      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('category', category)
      formData.append('description', description.trim())
      formData.append('price', price)
      formData.append('quantity', quantity)
      formData.append('unit', unit)
      formData.append('location', location.trim())

      if (imageFile) {
        formData.append('image', imageFile)
      } else if (imagePreset) {
        formData.append('image', imagePreset)
      }

      const res = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.data && res.data.success) {
        navigate('/farmer/products')
      }
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.response?.data?.message || 'Failed to update product.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          to="/farmer/products"
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Products</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Edit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Agricultural Produce</h1>
            <p className="text-sm text-slate-500">Update price, stock quantity, or details of your product</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Image Display */}
          {currentImage && (
            <div className="flex items-center space-x-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <img
                src={getProductImageUrl(currentImage, name, category)}
                alt="Current"
                className="w-16 h-16 object-cover rounded-lg border border-slate-300"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/products/tomato.jpg'
                }}
              />
              <div>
                <span className="text-xs font-bold text-slate-600 block">Current Image</span>
                <span className="text-xs text-slate-400 truncate block max-w-xs">{currentImage}</span>
              </div>
            </div>
          )}

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
            ></textarea>
          </div>

          {/* Price, Quantity, Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Unit *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Harvest / Farm Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
            />
          </div>

          {/* New Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Update Image (Optional)</label>

            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-3">
              <div className="flex items-center space-x-3">
                <Upload className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0])
                    }
                  }}
                  className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500 block mb-1">Or choose an existing product image preset:</span>
                <select
                  value={imagePreset}
                  onChange={(e) => setImagePreset(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Keep current image...</option>
                  <option value="tomato.jpg">tomato.jpg</option>
                  <option value="potato.jpg">potato.jpg</option>
                  <option value="onion.jpg">onion.jpg</option>
                  <option value="banana.jpg">banana.jpg</option>
                  <option value="apple.jpg">apple.jpg</option>
                  <option value="carrot.jpg">carrot.jpg</option>
                  <option value="chickpeas.jpg">chickpeas.jpg</option>
                  <option value="chilli.jpg">chilli.jpg</option>
                  <option value="greens.jpg">greens.jpg</option>
                  <option value="mango.jpg">mango.jpg</option>
                  <option value="rice.jpg">rice.jpg</option>
                  <option value="turmeric.jpg">turmeric.jpg</option>
                  <option value="wheat.jpg">wheat.jpg</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50 mt-4 text-sm"
          >
            {submitting ? 'Updating Product...' : 'Update Product Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
