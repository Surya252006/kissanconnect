import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api.js'
import { ArrowLeft, PlusCircle, AlertCircle, Upload, Sparkles, Image as ImageIcon, MapPin, Tag } from 'lucide-react'

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others']
const UNITS = ['kg', 'quintal', 'ton', 'piece', 'dozen']

export const AddProduct = () => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Vegetables')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [location, setLocation] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreset, setImagePreset] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

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

      const res = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.data && res.data.success) {
        navigate('/farmer/products')
      }
    } catch (err) {
      console.error('Error adding product:', err)
      setError(err.response?.data?.message || 'Failed to add product. Please check your inputs.')
    } finally {
      setSubmitting(false)
    }
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
          <div className="p-3.5 bg-amber-100 text-amber-900 rounded-2xl shadow-inner">
            <PlusCircle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">List New Harvest Produce</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Publish your crops directly to thousands of buyers with transparent pricing
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
          {/* Section 1: Produce Identification */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Produce Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crop / Produce Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Roma Tomatoes"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Description & Quality Notes</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe variety, freshness, harvest timing, pesticide-free practices..."
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="40"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harvest Stock *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit Type *</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">District / Farm Village</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Pollachi, Coimbatore, Tamil Nadu"
                className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
              />
            </div>
          </div>

          {/* Section 4: Image Showcase */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>4. Crop Image & Preview</span>
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
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  Or select a standard agricultural preset:
                </span>
                <select
                  value={imagePreset}
                  onChange={handlePresetChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">Choose preset...</option>
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
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Live Preview:</span>
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
            {submitting ? 'Publishing Listing...' : 'Publish Harvest to Marketplace'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
