import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  RotateCcw,
  PlusCircle,
  MapPin,
  Calendar,
  AlertCircle,
  Tag,
  DollarSign,
} from 'lucide-react'

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others']

const PriceInsights = () => {
  const { user } = useAuth()
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  // Admin Add Modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('Vegetables')
  const [formMarketPrice, setFormMarketPrice] = useState('')
  const [formPlatformPrice, setFormPlatformPrice] = useState('')
  const [formUnit, setFormUnit] = useState('kg')
  const [formLocation, setFormLocation] = useState('')
  const [formTrend, setFormTrend] = useState('STABLE')
  const [submitting, setSubmitting] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (search.trim()) params.append('search', search.trim())
      if (category) params.append('category', category)
      if (location.trim()) params.append('location', location.trim())

      const res = await api.get(`/price-insights?${params.toString()}`)
      if (res.data && res.data.success) {
        setInsights(res.data.data.insights || [])
      }
    } catch (err) {
      console.error('Error fetching price insights:', err)
      setError(err.response?.data?.message || 'Failed to load price insights.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [search, category, location])

  const handleClearFilters = () => {
    setSearch('')
    setCategory('')
    setLocation('')
  }

  const handleCreateInsight = async (e) => {
    e.preventDefault()
    setModalError('')

    if (!formName.trim() || formMarketPrice === '' || formPlatformPrice === '') {
      setModalError('Please fill in all required fields.')
      return
    }

    try {
      setSubmitting(true)
      const res = await api.post('/price-insights', {
        productName: formName.trim(),
        category: formCategory,
        marketPrice: Number(formMarketPrice),
        platformPrice: Number(formPlatformPrice),
        unit: formUnit,
        location: formLocation.trim(),
        trend: formTrend,
      })

      if (res.data && res.data.success) {
        setShowAddModal(false)
        setFormName('')
        setFormMarketPrice('')
        setFormPlatformPrice('')
        setFormLocation('')
        fetchInsights()
      }
    } catch (err) {
      console.error('Error creating price insight:', err)
      setModalError(err.response?.data?.message || 'Failed to create price insight.')
    } finally {
      setSubmitting(false)
    }
  }

  const getTrendBadge = (trend) => {
    switch (trend) {
      case 'UP':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            <TrendingUp className="w-3.5 h-3.5 text-red-600" />
            <span>Trending Up</span>
          </span>
        )
      case 'DOWN':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
            <span>Trending Down</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <Minus className="w-3.5 h-3.5 text-slate-500" />
            <span>Stable</span>
          </span>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Agricultural Price Insights</h1>
          <p className="text-sm text-emerald-100 mt-1">
            Compare local Mandi market rates with direct KisanConnect platform farm prices
          </p>
        </div>

        {user && user.role === 'ADMIN' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-xl transition-colors shadow text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Price Insight</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Search Produce</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Tomato, Onion..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Location / Mandi</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter location..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
        </div>

        {/* Clear Filters */}
        <div>
          <button
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center space-x-1 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Content Grid / Loading / Error */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-3">
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center space-y-2">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <DollarSign className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">No Price Insights Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            No price benchmarking entries match your current search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((item) => {
            const diff = item.marketPrice - item.platformPrice
            const isCheaperOnPlatform = diff > 0
            const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-5 flex flex-col justify-between hover:border-emerald-300 transition-all space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-black text-slate-800 mt-1">{item.productName}</h3>
                    </div>
                    <div>{getTrendBadge(item.trend)}</div>
                  </div>

                  {/* Price Comparison Card */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mt-3 text-center">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block">Mandi / Market</span>
                      <span className="text-lg font-bold text-slate-700">₹{item.marketPrice}</span>
                      <span className="text-[10px] text-slate-400"> / {item.unit}</span>
                    </div>

                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[11px] font-semibold text-emerald-700 block">KisanConnect</span>
                      <span className="text-lg font-extrabold text-emerald-700">₹{item.platformPrice}</span>
                      <span className="text-[10px] text-emerald-600"> / {item.unit}</span>
                    </div>
                  </div>

                  {/* Price Difference Indicator */}
                  <div className="mt-3 p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-100">
                    <span>Direct Farm Savings:</span>
                    <span className="font-bold">
                      {isCheaperOnPlatform ? `₹${diff.toFixed(2)} cheaper / ${item.unit}` : `₹${Math.abs(diff).toFixed(2)} variance`}
                    </span>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  {item.location && (
                    <span className="flex items-center truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </span>
                  )}
                  <span className="flex items-center text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formattedDate}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Admin Add Insight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">Add Market Price Insight</h3>

            {modalError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg">{modalError}</div>
            )}

            <form onSubmit={handleCreateInsight} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Produce Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Tomato"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mandi Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formMarketPrice}
                    onChange={(e) => setFormMarketPrice(e.target.value)}
                    placeholder="45"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Platform Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formPlatformPrice}
                    onChange={(e) => setFormPlatformPrice(e.target.value)}
                    placeholder="40"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Location / Mandi</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Coimbatore"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trend</label>
                  <select
                    value={formTrend}
                    onChange={(e) => setFormTrend(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="STABLE">Stable</option>
                    <option value="UP">Trending Up</option>
                    <option value="DOWN">Trending Down</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Insight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceInsights
