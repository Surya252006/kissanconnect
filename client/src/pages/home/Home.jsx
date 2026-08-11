import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import api from '../../services/api.js'
import FarmerHeroSlider from '../../components/home/FarmerHeroSlider.jsx'
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
  HeartHandshake,
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
    { name: 'Vegetables', icon: '🥦', image: '/products/tomato.jpg', count: 'Direct Field Crops', tag: 'Fresh Harvest' },
    { name: 'Fruits', icon: '🍎', image: '/products/banana.jpg', count: 'Orchard Harvests', tag: 'Sun-Ripened' },
    { name: 'Grains', icon: '🌾', image: '/products/wheat.jpg', count: 'Staple Harvests', tag: 'Direct Wholesale' },
    { name: 'Spices', icon: '🌶️', image: '/products/turmeric.jpg', count: 'Aromatic & Pure', tag: 'GI Certified' },
    { name: 'Pulses', icon: '🫘', image: '/products/chickpeas.jpg', count: 'High-Protein Yields', tag: 'Unpolished' },
  ]

  const farmerImpactStories = [
    {
      title: 'Women-Led Organic Farming',
      location: 'Nashik Valley, Maharashtra',
      farmer: 'Sunita Devi & Self-Help Group',
      image: '/images/slide_women_farmers.png',
      desc: 'Direct market sales enabled 45+ women farmers to eliminate local broker markups and earn 35% higher net income on fresh greens.',
      stat: '+35% Net Farmer Margin',
    },
    {
      title: 'Smart Grain & Wheat Production',
      location: 'Ludhiana, Punjab',
      farmer: 'Gurpreet Singh',
      image: '/images/slide_smart_farmer.png',
      desc: 'Using KisanConnect real-time Mandi price matching to sell high-grade wheat harvests directly to commercial bakeries and retailers.',
      stat: '100% Direct Settlement',
    },
    {
      title: 'Certified Orchard Direct Sourcing',
      location: 'Wayanad, Kerala',
      farmer: 'Ananya Roy & Orchard Producers',
      image: '/images/slide_orchard_harvest.png',
      desc: 'Direct harvest delivery of organic turmeric, pepper, and fresh fruits directly to urban consumers with verified GI origin seals.',
      stat: 'Verified GI Harvest',
    },
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
      {/* 🌟 1. INTERACTIVE FARMER VISUAL HERO SLIDER */}
      <FarmerHeroSlider />

      {/* 📊 2. LIVE PLATFORM METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalFarmers}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Farmers Connected</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-amber-50 text-amber-700 rounded-2xl">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalProducts}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Harvests Listed</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-blue-50 text-blue-700 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalOrders}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Orders Delivered</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center space-x-4 hover:border-emerald-300 hover:shadow-md transition-all">
          <div className="p-3.5 bg-purple-50 text-purple-700 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.verifiedProducts}+</div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">Verified Listings</p>
          </div>
        </div>
      </section>

      {/* 🌾 3. HARVEST CATEGORIES WITH REAL PRODUCE VISUALS */}
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
            <span>View all produce catalog</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/marketplace`}
              className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 flex flex-col h-52 sm:h-60 bg-slate-900"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-75 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              <div className="absolute top-3 left-3">
                <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                  {cat.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xl mb-1 block">{cat.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  {cat.count}
                </span>
                <h3 className="text-lg font-black">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🖼️ 4. VISUAL FARMER IMPACT STORIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Grassroots Impact
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Farmer Voices & Direct Trade Stories</h2>
          </div>
          <Link
            to="/register"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
          >
            <span>Join our farmer network</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farmerImpactStories.map((story, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/products/tomato.jpg'
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                      {story.stat}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      📍 {story.location}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1 leading-snug">
                      {story.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {story.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-3 pt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{story.farmer}</span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Producer</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⚖️ 5. MANDI BENCHMARK & HARVEST FLATLAY BANNER */}
      <section className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-emerald-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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

      {/* 🔄 6. 6-STEP VISUAL WORKFLOW */}
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

      {/* 🌟 7. FINAL CTA BANNER */}
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
