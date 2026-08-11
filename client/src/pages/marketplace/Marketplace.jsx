import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import { VerifiedBadge } from '../../components/ui/Badge.jsx'
import { ProductSkeleton } from '../../components/ui/LoadingSkeleton.jsx'
import { EmptyState } from '../../components/ui/EmptyState.jsx'
import {
  Search,
  Filter,
  RotateCcw,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  Package,
  Eye,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

const CATEGORIES = [
  { name: 'All', icon: '🌾' },
  { name: 'Vegetables', icon: '🥦' },
  { name: 'Fruits', icon: '🍎' },
  { name: 'Grains', icon: '🌾' },
  { name: 'Pulses', icon: '🫘' },
  { name: 'Spices', icon: '🌶️' },
  { name: 'Others', icon: '📦' },
]

export const Marketplace = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters and pagination state
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [locationFilter, setLocationFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 })

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (search.trim()) params.append('search', search.trim())
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory)
      if (locationFilter.trim()) params.append('location', locationFilter.trim())
      if (minPrice !== '') params.append('minPrice', minPrice)
      if (maxPrice !== '') params.append('maxPrice', maxPrice)
      if (sortBy) params.append('sort', sortBy)
      params.append('page', page)
      params.append('limit', 12)

      const res = await api.get(`/products?${params.toString()}`)
      if (res.data && res.data.success) {
        let prods = res.data.data.products || []
        if (verifiedOnly) {
          prods = prods.filter((p) => p.isVerified || p.farmerId?.isVerified)
        }
        setProducts(prods)
        setPagination(res.data.data.pagination || { page: 1, limit: 12, total: prods.length, pages: 1 })
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.response?.data?.message || 'Failed to load products from marketplace.')
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory, locationFilter, minPrice, maxPrice, sortBy, verifiedOnly, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleClearFilters = () => {
    setSearch('')
    setSelectedCategory('All')
    setLocationFilter('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
    setVerifiedOnly(false)
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-8 sm:p-10 shadow-xl border border-emerald-700/60">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Farm-Direct Wholesale & Retail</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Agricultural Marketplace</h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
            Browse authentic harvests directly from verified Indian farmers. Guaranteed transparent Mandi price benchmarking and zero intermediary markups.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name
          return (
            <button
              key={cat.name}
              onClick={() => {
                setSelectedCategory(cat.name)
                setPage(1)
              }}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30 ring-2 ring-emerald-600'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          )
        })}
      </div>

      {/* Controls Container: Search, Filters & Sorting */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-4">
        {/* Top Row: Search input & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Box */}
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search produce by name, crop type, or location (e.g. Tomatoes, Nashik)..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm font-medium transition-all"
            />
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            >
              <option value="newest">Fresh Arrivals (Newest)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Detailed Filters Row */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Location Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Location / District</label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value)
                setPage(1)
              }}
              placeholder="Filter by city/state..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Min Price (₹)</label>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value)
                setPage(1)
              }}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Max Price (₹)</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
                setPage(1)
              }}
              placeholder="500"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center space-x-2 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
              />
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Only</span>
              </span>
            </label>
          </div>

          {/* Clear Filters Button */}
          <div>
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center space-x-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-black text-slate-800 flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          <span>Available Farm Produce</span>
          {!loading && (
            <span className="text-xs bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
              {pagination.total || products.length} available
            </span>
          )}
        </h2>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center space-y-3">
          <p className="font-bold">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow"
          >
            Retry Loading
          </button>
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No Produce Matches Your Filters"
          description="Try broadening your search term, clearing category filters, or exploring all fresh arrivals."
          actionText="Reset All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const isVerified = product.isVerified || product.farmerId?.isVerified
            return (
              <div
                key={product._id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={getProductImageUrl(product.image, product.name, product.category)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/products/tomato.jpg'
                    }}
                  />
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  {isVerified && (
                    <div className="absolute top-3.5 right-3.5">
                      <VerifiedBadge isVerified={true} size="sm" />
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    {product.description && (
                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
                        {product.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                      {product.location && (
                        <div className="flex items-center text-slate-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-1.5 flex-shrink-0" />
                          <span className="truncate">{product.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-slate-500 font-medium">
                        <Tag className="w-3.5 h-3.5 text-amber-500 mr-1.5 flex-shrink-0" />
                        <span>
                          Stock: <strong className="text-slate-800 font-bold">{product.quantity} {product.unit}</strong> available
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & View CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase tracking-wider">
                        Direct Price
                      </span>
                      <div className="flex items-baseline space-x-0.5">
                        <span className="text-xl font-black text-emerald-800">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/{product.unit}</span>
                      </div>
                    </div>

                    <Link
                      to={`/products/${product._id}`}
                      className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all border border-emerald-200 hover:border-emerald-600 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-3 pt-6 border-t border-slate-200">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-black text-slate-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
            disabled={page >= pagination.pages}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Marketplace
