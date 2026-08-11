import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api.js'
import { ArrowLeft, PlusCircle, AlertCircle, Upload } from 'lucide-react'

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others']
const UNITS = ['kg', 'quintal', 'ton', 'piece', 'dozen']

const AddProduct = () => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Vegetables')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [location, setLocation] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreset, setImagePreset] = useState('')

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

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
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add New Agricultural Produce</h1>
            <p className="text-sm text-slate-500">List your harvest on the KisanConnect marketplace</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Organic Tomatoes"
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
              placeholder="Describe fresh produce quality, harvest date, organic status..."
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
                placeholder="40"
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
                placeholder="100"
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
              placeholder="e.g. Pollachi, Coimbatore"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Product Image</label>

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
                  <option value="">Select preset image...</option>
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
            {submitting ? 'Saving Product...' : 'Publish Product to Marketplace'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
