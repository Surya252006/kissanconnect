import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { UserPlus, AlertCircle, Sprout, ShoppingBag, Store, Building2 } from 'lucide-react'

export const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('CONSUMER')
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setSubmitting(true)
      const user = await register({ name, email, password, phone, role, location })
      if (user.role === 'FARMER') {
        navigate('/farmer/products')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const roleOptions = [
    { key: 'CONSUMER', label: 'Buyer / Consumer', icon: ShoppingBag, desc: 'Buy fresh crops directly' },
    { key: 'FARMER', label: 'Farmer / Producer', icon: Sprout, desc: 'List & sell harvest' },
    { key: 'RETAILER', label: 'Retailer', icon: Store, desc: 'Commercial retail sourcing' },
    { key: 'WHOLESALER', label: 'Wholesaler', icon: Building2, desc: 'Bulk agricultural trade' },
  ]

  return (
    <div className="max-w-xl mx-auto my-8 space-y-6 pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-900 mb-1 shadow-inner">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Create an Account</h1>
          <p className="text-xs text-slate-500 font-medium">
            Join KisanConnect to eliminate agricultural middleman fees
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Your Role *</label>
            <div className="grid grid-cols-2 gap-2.5">
              {roleOptions.map((opt) => {
                const Icon = opt.icon
                const isSelected = role === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setRole(opt.key)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 shadow-sm'
                        : 'border-slate-200 bg-stone-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                      <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-emerald-600' : 'bg-slate-300'}`}></span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[10px] text-slate-500">{opt.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
              placeholder="e.g. Ramesh Patel"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
                placeholder="ramesh@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Location / District</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-xs font-medium"
              placeholder="e.g. Coimbatore, Tamil Nadu"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-2 text-xs"
          >
            {submitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-700 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
