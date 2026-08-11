import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api.js'
import { getProductImageUrl } from '../../utils/imageHelper.js'
import {
  Search,
  Filter,
  RotateCcw,
  CheckCircle,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  Package,
  Eye,
} from 'lucide-react'

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Others']

const Marketplace = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters and pagination state
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 })

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()
      if (search.trim()) params.append('search', search.trim())
      if (selectedCategory) params.append('category', selectedCategory)
      if (locationFilter.trim()) params.append('location', locationFilter.trim())
      if (minPrice !== '') params.append('minPrice', minPrice)
      if (maxPrice !== '') params.append('maxPrice', maxPrice)
      if (sortBy) params.append('sort', sortBy)
      params.append('page', page)
      params.append('limit', 12)

      const res = await api.get(`/products?${params.toString()}`)
      if (res.data && res.data.success) {
        setProducts(res.data.data.products || [])
        setPagination(res.data.data.pagination || { page: 1, limit: 12, total: 0, pages: 1 })
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.response?.data?.message || 'Failed to load products from marketplace.')
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory, locationFilter, minPrice, maxPrice, sortBy, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleClearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setLocationFilter('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('newest')
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Agricultural Marketplace
          </h1>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base">
            Directly connect with local farmers. Fresh, verified produce straight from farms across India.
          </p>
        </div>
      </div>

      {/* Controls Container: Search, Filters & Sorting */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4">
        {/* Top Row: Search input & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search products by name, category, or location (e.g. Tomato, Coimbatore)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 text-sm"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Options Row */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setPage(1)
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value)
                setPage(1)
              }}
              placeholder="Filter location..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Min Price (₹)</label>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value)
                setPage(1)
              }}
              placeholder="0"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Max Price (₹)</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
                setPage(1)
              }}
              placeholder="1000"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          {/* Clear Filters Button */}
          <div>
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center space-x-1 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <span>Available Produce</span>
          {!loading && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              {pagination.total} total
            </span>
          )}
        </h2>
      </div>

      {/* Product List Grid / Loading / Error */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 animate-pulse space-y-3">
              <div className="w-full h-44 bg-slate-200 rounded-lg"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            Retry Loading
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <Package className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-xl font-bold text-slate-700">No Products Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            We couldn't find any products matching your current filters. Try searching for something else or clear filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const isVerified = product.isVerified || product.farmerId?.isVerified
            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 hover:border-emerald-300 transition-all overflow-hidden flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={getProductImageUrl(product.image, product.name, product.category)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/products/tomato.jpg'
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {isVerified && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    {product.description && (
                      <p className="text-slate-500 text-xs line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      {product.location && (
                        <div className="flex items-center text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                          <span className="truncate">{product.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-slate-500">
                        <Tag className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                        <span>Qty: <strong className="text-slate-700">{product.quantity} {product.unit}</strong> available</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Price</span>
                      <span className="text-lg font-extrabold text-emerald-700">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-slate-500"> / {product.unit}</span>
                    </div>

                    <Link
                      to={`/products/${product._id}`}
                      className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 transition-colors border border-emerald-200 hover:border-emerald-600"
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
            className="flex items-center space-x-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-bold text-slate-600">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
            disabled={page >= pagination.pages}
            className="flex items-center space-x-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
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
