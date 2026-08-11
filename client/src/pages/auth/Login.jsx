import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { LogIn, AlertCircle, Sprout, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please provide both email and password.')
      return
    }

    try {
      setSubmitting(true)
      const user = await login(email, password)
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (user.role === 'FARMER') {
        navigate('/farmer/products')
      } else {
        navigate(from === '/login' || from === '/register' ? '/' : from, { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto my-8 space-y-6 pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 mb-1 shadow-inner">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500 font-medium">
            Sign in to access your direct agricultural marketplace account
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
              placeholder="farmer@kissanconnect.in"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-2 text-xs"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Demo Accounts Selector for Judges */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Quick 1-Click Demo Accounts (Judges / Testing)
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@kissanconnect.in', 'admin123')}
              className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-xl text-center transition-colors text-[11px] font-bold flex flex-col items-center"
            >
              <ShieldCheck className="w-3.5 h-3.5 mb-0.5 text-purple-700" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('buyer@kissanconnect.in', 'buyer123')}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-center transition-colors text-[11px] font-bold flex flex-col items-center"
            >
              <ShoppingBag className="w-3.5 h-3.5 mb-0.5 text-emerald-700" />
              <span>Buyer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('farmer.demo@kissanconnect.in', 'DemoPass123!')}
              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-center transition-colors text-[11px] font-bold flex flex-col items-center"
            >
              <Sprout className="w-3.5 h-3.5 mb-0.5 text-amber-700" />
              <span>Farmer</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-700 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
