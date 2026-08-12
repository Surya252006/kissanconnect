import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  Sprout,
  ShoppingBag,
  PlusCircle,
  LogOut,
  LogIn,
  UserPlus,
  PackageCheck,
  ClipboardList,
  Truck,
  TrendingUp,
  ShieldCheck,
  LayoutDashboard,
  Home as HomeIcon,
  Menu,
  X,
  User,
  ChevronDown,
  Bot,
  Sparkles,
} from 'lucide-react'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
    setMobileMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-emerald-900 text-white shadow-md sticky top-0 z-50 border-b border-emerald-800/80 backdrop-blur-md bg-emerald-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="bg-emerald-600 p-2 rounded-xl text-white group-hover:bg-emerald-500 transition-transform duration-200 group-hover:scale-105 shadow-sm">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">KisanConnect</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-full border border-emerald-700">
                Direct Agri Trade
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/')
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/marketplace"
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/marketplace')
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </Link>

            <Link
              to="/price-insights"
              className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/price-insights')
                  ? 'bg-emerald-800 text-white shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>Price Insights</span>
            </Link>

            {/* 🤖 KisanMitra AI Navigation Link */}
            <Link
              to="/ai-chat"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                isActive('/ai-chat')
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                  : 'bg-emerald-800/80 hover:bg-emerald-800 text-amber-300 border border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>KisanMitra AI</span>
            </Link>

            {/* Authenticated Links for Buyers/Consumers */}
            {user && (
              <Link
                to="/my-orders"
                className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/my-orders')
                    ? 'bg-emerald-800 text-white shadow-inner'
                    : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>My Orders</span>
              </Link>
            )}

            {/* Farmer Navigation */}
            {user && user.role === 'FARMER' && (
              <>
                <Link
                  to="/farmer/orders"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/farmer/orders')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-amber-200 hover:bg-emerald-800/60'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Customer Orders</span>
                </Link>
                <Link
                  to="/farmer/products"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/farmer/products')
                      ? 'bg-emerald-800 text-white shadow-inner'
                      : 'text-emerald-100 hover:bg-emerald-800/60'
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>My Produce</span>
                </Link>
                <Link
                  to="/farmer/products/add"
                  className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-transform duration-150 hover:scale-105 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List Produce</span>
                </Link>
              </>
            )}

            {/* Admin Navigation */}
            {user && user.role === 'ADMIN' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/admin/dashboard')
                      ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                      : 'text-purple-200 hover:bg-emerald-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/admin/verifications"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/admin/verifications')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-amber-200 hover:bg-emerald-800/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifications</span>
                </Link>
              </>
            )}
          </div>

          {/* User Profile / Auth Area */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 bg-emerald-950/60 hover:bg-emerald-950 border border-emerald-700/60 px-3 py-1.5 rounded-xl transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight max-w-[100px] truncate">
                      {user.name}
                    </p>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>

                    {user.role === 'FARMER' && (
                      <>
                        <Link
                          to="/farmer/products"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>My Produce Listings</span>
                        </Link>
                        <Link
                          to="/farmer/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Customer Orders</span>
                        </Link>
                      </>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span>My Purchase Orders</span>
                    </Link>

                    <Link
                      to="/ai-chat"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                    >
                      <Bot className="w-4 h-4 text-amber-600" />
                      <span>KisanMitra AI Assistant</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 border border-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-950/95 border-t border-emerald-800/80 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-100 hover:bg-emerald-900"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-100 hover:bg-emerald-900"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplace</span>
          </Link>

          <Link
            to="/price-insights"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-300 hover:bg-emerald-900"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Price Insights</span>
          </Link>

          <Link
            to="/ai-chat"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40"
          >
            <Bot className="w-4 h-4" />
            <span>KisanMitra AI Assistant</span>
          </Link>

          {user && (
            <Link
              to="/my-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-100 hover:bg-emerald-900"
            >
              <ClipboardList className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
          )}

          {user && user.role === 'FARMER' && (
            <>
              <Link
                to="/farmer/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-100 hover:bg-emerald-900"
              >
                <PackageCheck className="w-4 h-4" />
                <span>My Produce</span>
              </Link>
              <Link
                to="/farmer/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-200 hover:bg-emerald-900"
              >
                <Truck className="w-4 h-4" />
                <span>Customer Orders</span>
              </Link>
              <Link
                to="/farmer/products/add"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 bg-amber-500 text-slate-950 px-3 py-2.5 rounded-xl text-sm font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Produce</span>
              </Link>
            </>
          )}

          {user && user.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-purple-300 hover:bg-emerald-900"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                to="/admin/verifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-300 hover:bg-emerald-900"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verifications Queue</span>
              </Link>
            </>
          )}

          <div className="border-t border-emerald-800/80 pt-3 mt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-emerald-300 uppercase">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1 border border-emerald-700 text-white py-2 rounded-xl text-xs font-bold text-center"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-1 bg-amber-500 text-slate-950 py-2 rounded-xl text-xs font-black text-center shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
