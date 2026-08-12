import { GoogleGenAI } from '@google/genai'
import Product from '../models/Product.js'
import PriceInsight from '../models/PriceInsight.js'

// Intelligent fallback knowledge engine for seamless offline / demo execution
const generateLocalFallback = (prompt, context) => {
  const p = prompt.toLowerCase()

  if (p.includes('mandi') || p.includes('price') || p.includes('rate') || p.includes('benchmark')) {
    const list = context.insights.map((i) => `• **${i.productName}**: Mandi Rate: ₹${i.marketPrice}/${i.unit} vs KisanConnect Direct: ₹${i.platformPrice}/${i.unit} (Save ₹${(i.marketPrice - i.platformPrice).toFixed(2)})`).join('\n')
    return `🌾 **Live APMC Mandi Price Intelligence**:\n\nHere are the current benchmark rates compared to direct KisanConnect farm prices:\n\n${list || '• Tomatoes: Mandi ₹45/kg vs KisanConnect ₹40/kg\n• Wheat: Mandi ₹35/kg vs KisanConnect ₹28/kg'}\n\n💡 *Tip: On KisanConnect, buyers save an average of 15–25% by purchasing directly from verified farmers without middleman markups!*`
  }

  if (p.includes('buy') || p.includes('product') || p.includes('produce') || p.includes('tomato') || p.includes('wheat') || p.includes('onion') || p.includes('potato') || p.includes('available')) {
    const prods = context.products.slice(0, 4).map((pr) => `• **${pr.name}** (${pr.category}): ₹${pr.price}/${pr.unit} • Stock: ${pr.quantity} ${pr.unit} • Location: ${pr.location || 'Local Farm'}`).join('\n')
    return `🛒 **Fresh Produce Currently Available on KisanConnect**:\n\n${prods || '• Organic Roma Tomatoes: ₹40/kg\n• Golden Sharbati Wheat: ₹28/kg\n• Red Nashik Onions: ₹32/kg'}\n\n👉 You can browse all crops with 1-click on the **[Marketplace](/marketplace)** page.`
  }

  if (p.includes('pest') || p.includes('disease') || p.includes('fertilizer') || p.includes('organic') || p.includes('grow') || p.includes('crop')) {
    return `🌱 **KisanMitra Crop Advisory & Soil Health Tips**:\n\n1. **Organic Pest Management**: Use Neem seed kernel extract (NSKE 5%) or Neem oil spray (3-5 ml/liter water) every 10–14 days for effective control against aphids, whiteflies, and fruit borers.\n2. **Soil Enrichment**: Incorporate well-decomposed Farm Yard Manure (FYM) or Vermicompost (2–3 tons/acre) combined with *Trichoderma viride* to prevent soil-borne fungal pathogens.\n3. **Water Management**: Implement drip irrigation or mulching with straw/crop residue to conserve 40% soil moisture and reduce weed germination.`
  }

  if (p.includes('verify') || p.includes('verification') || p.includes('gi tag') || p.includes('quality')) {
    return `🛡️ **KisanConnect Quality & Verification System**:\n\n• **For Farmers**: You can submit a verification request directly from **My Produce** (` + '`/farmer/products`' + `). Our audit team inspects GI tags, organic practices, and farm provenance.\n• **For Buyers**: Look for the green **Verified Quality** and **Verified Farmer** badges on product cards to guarantee 100% authentic, pesticide-inspected harvest.`
  }

  if (p.includes('order') || p.includes('track') || p.includes('delivery') || p.includes('logistics')) {
    return `🚚 **Order Tracking & Fulfillment Logistics**:\n\n• You can track live dispatch milestones (` + '`PACKED` → `PICKED_UP` → `IN_TRANSIT` → `DELIVERED`' + `) under **[My Orders](/my-orders)**.\n• Farmers receive real-time SMS/web notifications and update shipping stages directly from their **Customer Orders Dashboard**.`
  }

  return `🌿 **Namaste! I am KisanMitra AI, your intelligent farming & agri-trade assistant.**\n\nI can help you with:\n1. 📊 **APMC Mandi vs Farm Price Comparisons** (Finding best rates and savings)\n2. 🛒 **Marketplace Produce Discovery** (Finding verified farm harvests)\n3. 🌾 **Crop Health & Pest Advisory** (Organic solutions, fertilizers, weather care)\n4. 🛡️ **Produce Quality & GI Verification**\n5. 📦 **Order Logistics & Tracking**\n\nHow may I assist your agricultural journey today?`
}

// @desc    Process AI Chat message using Gemini Interactions API or intelligent Agri Engine
// @route   POST /api/chat
// @access  Public (Optional auth for personalized role advice)
export const handleAIChat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message for the AI assistant.',
      })
    }

    // 1. Gather live database context for real-time grounding
    const [recentProducts, priceInsights] = await Promise.all([
      Product.find({}).limit(8).select('name category price unit quantity location isVerified').lean(),
      PriceInsight.find({}).limit(6).select('productName category marketPrice platformPrice unit location trend').lean(),
    ])

    const userRole = req.user ? req.user.role : 'GUEST'
    const userName = req.user ? req.user.name : 'Farmer/Buyer'

    const dbContext = {
      products: recentProducts,
      insights: priceInsights,
      userRole,
      userName,
    }

    // 2. Check if GEMINI_API_KEY is available in environment
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey })

        const systemInstruction = `You are "KisanMitra AI" (किसान मित्र), the expert agricultural and marketplace AI assistant for KisanConnect.
You specialize in Indian agriculture, crop advisory, organic farming, APMC wholesale Mandi price benchmarks, and platform navigation.

Platform Grounding Context:
- Active Crops on Platform: ${JSON.stringify(recentProducts)}
- Live Mandi Rate Benchmarks: ${JSON.stringify(priceInsights)}
- Current User: ${userName} (Role: ${userRole})

Your Goals:
1. Provide accurate, encouraging, practical farming advice (pest control, soil nutrition, seasonal crops, organic remedies).
2. Highlight transparent price comparisons: show how KisanConnect direct farm rates eliminate middleman cuts compared to Mandi APMC rates.
3. Help users find crops, place orders, understand logistics tracking, and get produce quality verified.
4. Support multi-lingual queries (English, Hindi, Tamil, Telugu, Marathi, etc.).
5. Keep responses structured, concise, friendly, and formatted with markdown (bullet points, bold highlights, emoji tags).`

        // Construct input with prompt & context
        const response = await ai.interactions.create({
          model: 'gemini-3.6-flash',
          input: message,
          system_instruction: systemInstruction,
        })

        const replyText = response.output_text || response.text || generateLocalFallback(message, dbContext)

        return res.json({
          success: true,
          data: {
            reply: replyText,
            source: 'gemini-3.6-flash',
            timestamp: new Date().toISOString(),
          },
        })
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using intelligent local engine:', geminiErr.message)
      }
    }

    // 3. Fallback to Local Agri & Mandi Intelligence Engine
    const fallbackReply = generateLocalFallback(message, dbContext)
    return res.json({
      success: true,
      data: {
        reply: fallbackReply,
        source: 'kisanmitra-local-engine',
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error in AI chat endpoint:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat request.',
    })
  }
}
