import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import { ArrowLeft, Edit, AlertCircle, Upload, Sparkles, Image as ImageIcon, MapPin, Tag } from 'lucide-react'

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others']
const UNITS = ['kg', 'quintal', 'ton', 'piece', 'dozen']

export const EditProduct = () => {
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
  const [imagePreview, setImagePreview] = useState('')

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreset('')
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePresetChange = (e) => {
    const val = e.target.value
    setImagePreset(val)
    setImageFile(null)
    if (val) {
      setImagePreview(`/products/${val}`)
    } else {
      setImagePreview('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div>
        <Link
          to="/farmer/products"
          className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Produce</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-8">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-2xl shadow-inner">
            <Edit className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Update Harvest Produce</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Modify inventory quantity, update spot pricing, or edit crop information
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Image Display */}
          {currentImage && (
            <div className="flex items-center space-x-4 p-4 bg-stone-50 border border-slate-200 rounded-2xl">
              <img
                src={getProductImageUrl(currentImage, name, category)}
                alt="Current"
                className="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/products/tomato.jpg'
                }}
              />
              <div>
                <span className="text-xs font-black text-slate-700 block">Current Active Image</span>
                <span className="text-xs text-slate-400 font-mono truncate block max-w-xs">{currentImage}</span>
              </div>
            </div>
          )}

          {/* Section 1: Produce Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Produce Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-bold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
              ></textarea>
            </div>
          </div>

          {/* Section 2: Pricing & Stock */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>2. Direct Pricing & Inventory</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit *</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-bold"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Harvest Location</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          {/* Section 4: Image Update */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>4. Update Image (Optional)</span>
            </h3>

            <div className="p-5 bg-stone-50 border border-dashed border-slate-300 rounded-2xl space-y-4">
              <div className="flex items-center space-x-4">
                <Upload className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileChange}
                  className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-500 block mb-1">Or select a preset:</span>
                <select
                  value={imagePreset}
                  onChange={handlePresetChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
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

              {imagePreview && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">New Image Preview:</span>
                  <div className="h-40 w-40 rounded-2xl overflow-hidden border border-slate-300 shadow-sm">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-4 text-sm"
          >
            {submitting ? 'Saving Changes...' : 'Save Produce Updates'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
