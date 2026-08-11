import { useState, useEffect } from 'react'
import api from '../../services/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { TrendBadge } from '../../components/ui/Badge.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import { ProductSkeleton } from '../../components/ui/LoadingSkeleton.jsx'
import {
  TrendingUp,
  Search,
  RotateCcw,
  PlusCircle,
  MapPin,
  Calendar,
  AlertCircle,
  Sparkles,
  Scale,
} from 'lucide-react'

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others']

export const PriceInsights = () => {
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-10 shadow-xl border border-emerald-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-amber-300" />
            <span>Fair Trade Mandi Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Mandi Price Benchmarks</h1>
          <p className="text-sm text-emerald-100 font-medium">
            Real-time price comparisons between local APMC Mandis and direct KisanConnect farm listings.
          </p>
        </div>

        {user && user.role === 'ADMIN' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-2xl transition-all shadow-md text-xs relative z-10"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Benchmark</span>
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Search Crop / Produce</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Tomatoes, Wheat, Turmeric..."
              className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Crop Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-stone-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
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
          <label className="block text-xs font-bold text-slate-600 mb-1">Mandi / District</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Filter location..."
            className="w-full bg-stone-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
        </div>

        {/* Clear Filters */}
        <div>
          <button
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center space-x-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-3.5 rounded-xl text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Content Grid */}
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
        </div>
      ) : insights.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No Price Benchmark Matches"
          description="There are currently no recorded APMC Mandi price benchmarks matching your search criteria."
          actionText="Reset Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((item) => {
            const diff = item.marketPrice - item.platformPrice
            const isCheaperOnPlatform = diff > 0
            const pct = Math.round((Math.abs(diff) / item.marketPrice) * 100)
            const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md border border-slate-200 overflow-hidden p-6 flex flex-col justify-between hover:border-emerald-300 transition-all space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-2">{item.productName}</h3>
                    </div>
                    <div>
                      <TrendBadge trend={item.trend} diffPercentage={pct} />
                    </div>
                  </div>

                  {/* Price Comparison Card */}
                  <div className="grid grid-cols-2 gap-3 bg-stone-50 p-4 rounded-2xl border border-slate-200 text-center">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mandi Rate</span>
                      <span className="text-xl font-bold text-slate-700 line-through decoration-rose-400">₹{item.marketPrice}</span>
                      <span className="text-xs text-slate-500 font-medium">/{item.unit}</span>
                    </div>

                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">Direct Farm</span>
                      <span className="text-2xl font-black text-emerald-800">₹{item.platformPrice}</span>
                      <span className="text-xs text-emerald-700 font-bold">/{item.unit}</span>
                    </div>
                  </div>

                  {/* Price Savings Badge */}
                  <div className="p-3 rounded-xl text-xs font-bold flex items-center justify-between bg-emerald-50 text-emerald-900 border border-emerald-200">
                    <span>Direct Farm Savings:</span>
                    <span className="font-black bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      {isCheaperOnPlatform ? `Save ₹${diff.toFixed(2)} / ${item.unit} (${pct}% lower)` : `₹${Math.abs(diff).toFixed(2)} variance`}
                    </span>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  {item.location && (
                    <span className="flex items-center truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1 flex-shrink-0" />
                      <span className="truncate">{item.location} Mandi</span>
                    </span>
                  )}
                  <span className="flex items-center text-slate-400 text-[11px]">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-slate-900">Add Mandi Price Benchmark</h3>

            {modalError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl">{modalError}</div>
            )}

            <form onSubmit={handleCreateInsight} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Crop Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Tomato"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mandi Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formMarketPrice}
                    onChange={(e) => setFormMarketPrice(e.target.value)}
                    placeholder="45"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Direct Platform Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formPlatformPrice}
                    onChange={(e) => setFormPlatformPrice(e.target.value)}
                    placeholder="40"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mandi Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Coimbatore Mandi"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Market Trend</label>
                  <select
                    value={formTrend}
                    onChange={(e) => setFormTrend(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="STABLE">Stable</option>
                    <option value="UP">Trending Up</option>
                    <option value="DOWN">Trending Down</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Benchmark'}
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
