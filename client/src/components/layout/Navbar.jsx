import { Link, useNavigate } from 'react-router-dom'
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
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-emerald-600 p-2 rounded-lg group-hover:bg-emerald-500 transition-colors">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">KisanConnect</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-emerald-700 px-2 py-0.5 rounded text-emerald-100 font-medium">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2.5">
            <Link
              to="/"
              className="flex items-center space-x-1 px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </Link>

            <Link
              to="/price-insights"
              className="flex items-center space-x-1 px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors text-emerald-100"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:inline">Price Insights</span>
            </Link>

            {user && (
              <Link
                to="/my-orders"
                className="flex items-center space-x-1 px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">My Orders</span>
              </Link>
            )}

            {/* Farmer Navigation */}
            {user && user.role === 'FARMER' && (
              <>
                <Link
                  to="/farmer/orders"
                  className="flex items-center space-x-1 px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors text-amber-200"
                >
                  <Truck className="w-4 h-4" />
                  <span className="hidden lg:inline">Customer Orders</span>
                </Link>
                <Link
                  to="/farmer/products"
                  className="flex items-center space-x-1 px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span className="hidden lg:inline">My Produce</span>
                </Link>
                <Link
                  to="/farmer/products/add"
                  className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Product</span>
                </Link>
              </>
            )}

            {/* Admin Navigation */}
            {user && user.role === 'ADMIN' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1 px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors text-purple-200"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <Link
                  to="/admin/verifications"
                  className="flex items-center space-x-1 px-2.5 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors text-amber-200"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden lg:inline">Verifications</span>
                </Link>
              </>
            )}

            {/* Auth Buttons / User Info */}
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3 border-l border-emerald-700 pl-2 sm:pl-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-emerald-200 leading-tight font-medium">{user.name}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-900 text-amber-300">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center space-x-1 bg-red-600/80 hover:bg-red-600 text-white px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-emerald-700 pl-3">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 border border-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
