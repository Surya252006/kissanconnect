import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Scale,
  PackageCheck,
  Clock,
  Sparkles,
  Users,
  Activity,
  Award,
  ChevronRight,
  Zap,
} from 'lucide-react'

export const Home = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalFarmers: 12,
    totalProducts: 18,
    totalOrders: 24,
    verifiedProducts: 14,
  })

  // Fetch live stats from backend analytics if available
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/overview')
        if (res.data?.success && res.data?.data) {
          const d = res.data.data
          setStats({
            totalFarmers: d.totalFarmers || 12,
            totalProducts: d.totalProducts || 18,
            totalOrders: d.totalOrders || 24,
            verifiedProducts: d.verifiedProducts || 14,
          })
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    fetchStats()
  }, [])

  const categories = [
    { name: 'Vegetables', image: '/products/tomato.jpg', count: 'Fresh Field Crops', color: 'from-emerald-600 to-teal-800' },
    { name: 'Fruits', image: '/products/banana.jpg', count: 'Orchard Harvests', color: 'from-amber-500 to-orange-700' },
    { name: 'Grains', image: '/products/wheat.jpg', count: 'Staple Harvests', color: 'from-yellow-600 to-amber-800' },
    { name: 'Spices', image: '/products/turmeric.jpg', count: 'Aromatic & Ground', color: 'from-orange-600 to-red-800' },
    { name: 'Pulses', image: '/products/chickpeas.jpg', count: 'High-Protein Yields', color: 'from-emerald-700 to-green-900' },
  ]

  const workflowSteps = [
    {
      step: '01',
      title: 'Farmer Lists Harvest',
      desc: 'Farmers publish crop quantity, unit rates, and harvest location directly from their field.',
      icon: Sprout,
    },
    {
      step: '02',
      title: 'Quality & GI Inspection',
      desc: 'Listing audited against Mandi grading and organic standards for certified quality badges.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Price Transparency',
      desc: 'Buyers compare direct farm prices with local Mandi APMC rate benchmarks to verify savings.',
      icon: Scale,
    },
    {
      step: '04',
      title: 'Atomic Direct Order',
      desc: 'Single-click order placement with race-condition-safe inventory deduction.',
      icon: ShoppingBag,
    },
    {
      step: '05',
      title: 'End-to-End Tracking',
      desc: 'Real-time multi-stage logistics from farm packaging to transit and delivery.',
      icon: Truck,
    },
    {
      step: '06',
      title: 'Fresh Doorstep Arrival',
      desc: 'Crops arrive fresh at the buyer’s doorstep with 0% middleman commission fee cuts.',
      icon: PackageCheck,
    },
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* 🌟 HERO SECTION: Split Visual with Sunrise Farm Image & Glass Tags */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-2xl border border-emerald-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-14 relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-800/90 border border-emerald-500/50 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 uppercase tracking-wider shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>India's Direct Agricultural Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              From Farm to Buyer, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-200">
                Without the Middleman.
              </span>
            </h1>

            <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-xl font-medium">
              Connect directly with verified local farmers, discover transparent APMC Mandi price benchmarks, and track fresh produce orders end-to-end.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/marketplace"
                className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-7 py-4 rounded-2xl transition-all shadow-xl hover:shadow-amber-500/20 text-sm sm:text-base transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/price-insights"
                className="inline-flex items-center space-x-2 bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-500/50 text-white font-bold px-6 py-4 rounded-2xl transition-all text-sm sm:text-base backdrop-blur-sm"
              >
                <TrendingUp className="w-5 h-5 text-amber-300" />
                <span>Mandi Rates</span>
              </Link>

              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold px-6 py-4 rounded-2xl transition-all text-sm sm:text-base"
                >
                  <Sprout className="w-5 h-5 text-emerald-300" />
                  <span>Join as Farmer</span>
                </Link>
              )}
            </div>

            {/* Quick Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-emerald-200 font-semibold">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>100% Quality Inspected</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Direct Farmer Payouts</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Live Logistics Tracking</span>
              </span>
            </div>
          </div>

          {/* Hero Right Visual Presentation with Floating Tags */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-600/40 group">
              <img
                src="/images/hero_banner.png"
                alt="Lush Indian Farmland Harvest"
                className="w-full h-80 sm:h-96 lg:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = '/products/tomato.jpg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent"></div>

              {/* Floating Glass Tag 1: Quality Verified */}
              <div className="absolute top-4 left-4 glass-dark text-white px-3.5 py-2 rounded-2xl flex items-center space-x-2 animate-float">
                <div className="p-1.5 bg-emerald-500 rounded-xl text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Quality Tag</p>
                  <p className="text-xs font-black">GI & Organic Certified</p>
                </div>
              </div>

              {/* Floating Glass Tag 2: Savings Tag */}
              <div className="absolute bottom-4 right-4 glass-dark text-white px-4 py-2.5 rounded-2xl flex items-center space-x-2.5 animate-float-delayed">
                <div className="p-1.5 bg-amber-400 text-slate-950 rounded-xl font-black">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">Direct Savings</p>
                  <p className="text-xs font-black">15–30% Below Mandi Markup</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Glow Graphic */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* 📊 LIVE PLATFORM METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalFarmers}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Farmers Connected</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-amber-50 text-amber-700 rounded-2xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalProducts}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Harvests Listed</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-blue-50 text-blue-700 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalOrders}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Orders Delivered</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-purple-50 text-purple-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.verifiedProducts}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Verified Listings</p>
          </div>
        </div>
      </section>

      {/* 🌾 HARVEST CATEGORIES WITH REAL PRODUCE VISUALS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Fresh From The Soil
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Explore Harvest Categories</h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>View all produce</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/marketplace`}
              className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 flex flex-col h-48 sm:h-56 bg-slate-900"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  {cat.count}
                </span>
                <h3 className="text-lg font-black">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🤝 FARMER SPOTLIGHT & DIRECT TRADE STORY */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <img
              src="/images/farmer_story.png"
              alt="Indian Farmer With Digital Marketplace"
              className="w-full h-80 sm:h-96 object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/products/tomato.jpg'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                Farmer Spotlight
              </span>
              <h4 className="text-base font-black mt-1">Ramesh Patel • 15+ Acres Organic Farmer</h4>
              <p className="text-xs text-emerald-100">Coimbatore Agricultural Cluster</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Fair Trade Mission
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            Empowering Farmers With Direct Market Access
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Traditional supply chains eat up to 40% of agricultural margins through unauthorized middleman cuts. KisanConnect enables farmers to set their own fair harvest prices and publish directly to verified consumers and retail businesses.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-700">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-black text-emerald-700 block text-lg">0% Commissions</span>
              <p className="text-slate-500 font-medium">Direct payment settlements with no platform fee deduction.</p>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
              <span className="font-black text-amber-600 block text-lg">GI Verification</span>
              <p className="text-slate-500 font-medium">Audited quality seals to command premium market value.</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3.5 rounded-2xl transition-all shadow-md text-xs"
            >
              <span>Join as a Verified Producer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ⚖️ MANDI BENCHMARK & HARVEST FLATLAY BANNER */}
      <section className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center space-x-2 bg-emerald-800 border border-emerald-600 px-3 py-1 rounded-full text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Mandi Price Benchmarking</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Compare Real Mandi Rates Against Platform Prices
          </h2>

          <p className="text-emerald-100 text-sm leading-relaxed font-medium">
            We track daily APMC wholesale Mandi commodity prices across Indian districts so buyers always know exact direct savings per kilogram.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/price-insights"
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition-all shadow-md text-xs"
            >
              <span>View Live Mandi Benchmarks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden border-2 border-emerald-600/40 shadow-2xl">
            <img
              src="/images/fresh_harvest.png"
              alt="Fresh Indian Mandi Produce Flatlay"
              className="w-full h-64 sm:h-80 object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/products/tomato.jpg'
              }}
            />
          </div>
        </div>
      </section>

      {/* 🔄 6-STEP VISUAL WORKFLOW */}
      <section id="how-it-works" className="space-y-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Frictionless Agri Trade
          </span>
          <h2 className="text-3xl font-black text-slate-900">How KisanConnect Operates</h2>
          <p className="text-sm text-slate-500 font-medium">
            From the farmer's soil to the buyer's doorstep in 6 transparent, verified stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon
            return (
              <div
                key={idx}
                className="bg-stone-50 hover:bg-emerald-50/40 rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3.5 bg-white group-hover:bg-emerald-600 group-hover:text-white rounded-2xl shadow-sm text-emerald-700 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 group-hover:text-emerald-300 transition-colors">
                    {s.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-950 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 🌟 FINAL CTA BANNER */}
      <section className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-[2.5rem] p-8 sm:p-12 text-center space-y-5 shadow-xl border border-emerald-700/60">
        <h3 className="text-3xl sm:text-4xl font-black">Experience Direct Farm Trade Today</h3>
        <p className="text-sm text-emerald-100 max-w-xl mx-auto font-medium leading-relaxed">
          Join thousands of farmers, retail buyers, and consumers transforming Indian agriculture through transparency and trust.
        </p>
        <div className="pt-2 flex justify-center gap-4 flex-wrap">
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all shadow-lg text-sm transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Enter Marketplace</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
