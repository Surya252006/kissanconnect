import React, { useState, useEffect, useRef } from 'react'
import api from '../../services/api.js'
import {
  Bot,
  User,
  Send,
  Sparkles,
  Sprout,
  TrendingUp,
  ShieldCheck,
  Truck,
  RotateCcw,
  Scale,
  Leaf,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react'

const TOPICS = [
  { id: 'mandi', label: 'Mandi Price Rates', prompt: 'Compare local Mandi rates with KisanConnect direct farm prices for tomatoes, wheat, and onions.', icon: TrendingUp },
  { id: 'crops', label: 'Crop Advisory & Care', prompt: 'What are the best organic pest control methods and fertilizers for tomato and chilli crops?', icon: Sprout },
  { id: 'quality', label: 'Produce Verification', prompt: 'How does KisanConnect verify produce quality and GI origin seals for farmers?', icon: ShieldCheck },
  { id: 'logistics', label: 'Order & Logistics', prompt: 'How does atomic order placement and live multi-stage dispatch tracking work?', icon: Truck },
]

export const AIChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '🌾 **Namaste! Welcome to the KisanMitra AI Intelligence Center.**\n\nPowered by Google Gemini and real-time MongoDB agricultural database grounding, I can help you with:\n• **Daily APMC Mandi Price Benchmarks & Savings**\n• **Organic Soil & Pest Management Advisory**\n• **Direct Marketplace Crop Discovery**\n• **Quality Verification & Order Logistics**\n\nSelect a topic from the left or type any farming question below!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (queryText) => {
    const q = (queryText || input).trim()
    if (!q || loading) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!queryText) setInput('')
    setLoading(true)

    try {
      const res = await api.post('/chat', { message: q })
      if (res.data?.success && res.data?.data) {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.data.data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, botMsg])
      }
    } catch (err) {
      console.error('Chat error:', err)
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ An error occurred while communicating with KisanMitra AI. Please ensure the backend server is running.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const formatMessage = (content) => {
    return content.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g)
      return (
        <p key={idx} className={line.startsWith('•') || line.startsWith('-') ? 'pl-3 my-0.5' : 'my-1'}>
          {parts.map((p, pIdx) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={pIdx} className="font-extrabold text-slate-900">{p.slice(2, -2)}</strong>
            }
            return p
          })}
        </p>
      )
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-8 sm:p-10 shadow-xl border border-emerald-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Agricultural Intelligence Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">KisanMitra AI Assistant</h1>
          <p className="text-sm text-emerald-100 font-medium">
            Real-time crop advisory, APMC Mandi benchmarking, and direct market assistance.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 1,
                sender: 'bot',
                text: '🌾 Chat cleared. Ask any agricultural question or Mandi price comparison!',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Topic Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Recommended Topics</span>
            </h3>

            <div className="space-y-2.5">
              {TOPICS.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSend(t.prompt)}
                    disabled={loading}
                    className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/60 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl text-emerald-700 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 group-hover:text-emerald-950">
                          {t.label}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{t.prompt}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Assistant Info Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-900 font-black text-xs uppercase tracking-wider">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Context Grounding</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              KisanMitra combines Google Gemini with real-time active inventory data from KisanConnect’s MongoDB database to provide up-to-date Mandi pricing.
            </p>
          </div>
        </div>

        {/* Center / Right: Chat Feed & Input */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[640px]">
          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-stone-50/40">
            {messages.map((m) => {
              const isUser = m.sender === 'user'
              return (
                <div
                  key={m.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs shadow-sm ${
                      isUser ? 'bg-amber-500 text-slate-950 font-black' : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-3xl px-5 py-4 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none font-normal'
                    }`}
                  >
                    <div className="break-words">{isUser ? m.text : formatMessage(m.text)}</div>
                    <span className={`block text-[10px] mt-2 text-right ${isUser ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-2xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white text-slate-600 border border-slate-200 rounded-3xl rounded-tl-none px-5 py-4 text-xs shadow-sm flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-300"></span>
                  <span className="text-xs font-bold text-slate-500 ml-1">KisanMitra is computing agricultural response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about crop disease, organic farming, Mandi price savings..."
              className="flex-1 bg-stone-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-md flex items-center space-x-2 text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AIChatPage
