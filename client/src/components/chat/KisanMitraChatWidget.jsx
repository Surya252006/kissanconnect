import React, { useState, useEffect, useRef } from 'react'
import api from '../../services/api.js'
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Minimize2,
  Maximize2,
  Sprout,
  TrendingUp,
  ShieldCheck,
  Truck,
  HelpCircle,
} from 'lucide-react'

const SUGGESTED_PROMPTS = [
  { text: 'Compare Mandi vs Farm Rates', icon: TrendingUp },
  { text: 'Organic Pest Control Tips', icon: Sprout },
  { text: 'How to get Produce Quality Verified?', icon: ShieldCheck },
  { text: 'How to track crop dispatch & delivery?', icon: Truck },
]

export const KisanMitraChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '🌾 **Namaste! I am KisanMitra AI, your agricultural & market assistant.**\n\nHow can I help you today with crop health, APMC Mandi price benchmarks, or direct marketplace orders?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim()
    if (!query || loading) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const res = await api.post('/chat', { message: query })
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
        text: '⚠️ Unable to connect to the agricultural assistant at the moment. Please ensure the backend server is running and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: '🌾 Chat cleared. How can KisanMitra assist your farming or produce purchasing today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  // Simple Markdown-like formatter for bold, bullet points, and linebreaks
  const formatMessage = (content) => {
    return content.split('\n').map((line, idx) => {
      // Bold formatter
      const parts = line.split(/(\*\*.*?\*\*)/g)
      return (
        <p key={idx} className={line.startsWith('•') || line.startsWith('-') ? 'pl-2 my-0.5' : 'my-1'}>
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
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* 🟢 FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-3.5 rounded-full shadow-2xl hover:shadow-emerald-600/40 transition-all duration-300 transform hover:-translate-y-1 border border-emerald-400/40"
          aria-label="Open KisanMitra AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-800 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-800"></span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black tracking-wide leading-tight">KisanMitra AI</p>
            <p className="text-[10px] text-emerald-200 font-bold">Ask Agri & Mandi Expert</p>
          </div>
        </button>
      )}

      {/* 💬 EXPANDABLE CHAT DRAWER */}
      {isOpen && (
        <div
          className={`bg-white rounded-[2rem] shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isExpanded ? 'w-[92vw] sm:w-[650px] h-[85vh]' : 'w-[92vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-700/80 border border-emerald-500/40 rounded-2xl text-amber-300 shadow-inner">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-black">KisanMitra AI</h3>
                  <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider">
                    Gemini 3.6
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 font-medium flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Agri & Mandi Intelligence Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-emerald-200">
              <button
                onClick={handleClearChat}
                title="Clear Chat History"
                className="p-1.5 hover:bg-emerald-800/80 rounded-xl transition-colors text-xs"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand'}
                className="p-1.5 hover:bg-emerald-800/80 rounded-xl transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 hover:bg-emerald-800/80 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="bg-stone-50 border-b border-slate-200/80 px-3 py-2 flex items-center space-x-2 overflow-x-auto scrollbar-none">
            {SUGGESTED_PROMPTS.map((p, idx) => {
              const Icon = p.icon
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(p.text)}
                  disabled={loading}
                  className="flex items-center space-x-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap transition-colors shadow-2xs"
                >
                  <Icon className="w-3 h-3 text-emerald-600" />
                  <span>{p.text}</span>
                </button>
              )
            })}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
            {messages.map((m) => {
              const isUser = m.sender === 'user'
              return (
                <div key={m.id} className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                      isUser
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-normal'
                    }`}
                  >
                    <div className="break-words">{isUser ? m.text : formatMessage(m.text)}</div>
                    <span className={`block text-[9px] mt-1 text-right ${isUser ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              )
            })}

            {loading && (
              <div className="flex items-start space-x-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white text-slate-600 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs shadow-sm flex items-center space-x-2">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-300"></span>
                  <span className="text-[11px] font-bold text-slate-500 ml-1">KisanMitra is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-white border-t border-slate-200/80 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crop health, Mandi rates, orders..."
              className="flex-1 bg-stone-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default KisanMitraChatWidget
