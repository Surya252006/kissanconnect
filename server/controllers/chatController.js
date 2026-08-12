import { GoogleGenAI } from '@google/genai'
import Product from '../models/Product.js'
import PriceInsight from '../models/PriceInsight.js'

// Multi-language local fallback engine
const generateLocalFallback = (prompt, context, lang = 'en') => {
  const p = prompt.toLowerCase()

  // Tamil (தமிழ்)
  if (lang === 'ta') {
    if (p.includes('mandi') || p.includes('விலை') || p.includes('rate') || p.includes('விலை விபரம்')) {
      const list = context.insights.map((i) => `• **${i.productName}**: மண்டி விலை: ₹${i.marketPrice}/${i.unit} vs கிசான் கனெக்ட்: ₹${i.platformPrice}/${i.unit} (சேமிப்பு ₹${(i.marketPrice - i.platformPrice).toFixed(2)})`).join('\n')
      return `🌾 **நேரலை APMC மண்டி விலை விபரம்**:\n\nமண்டி விலைகளுடன் ஒப்பிடும் போது நேரடி விவசாய விலை விபரம்:\n\n${list || '• தக்காளி: மண்டி ₹45/kg vs கிசான் கனெக்ட் ₹35/kg\n• கோதுமை: மண்டி ₹35/kg vs கிசான் கனெக்ட் ₹28/kg'}\n\n💡 *குறிப்பு: கிசான் கனெக்ட் தளத்தில் விவசாயிகள் மற்றும் நுகர்வோர் இடைத்தரகர் கட்டணமின்றி 15–30% வரை சேமிக்கலாம்!*`
    }
    if (p.includes('பூச்சி') || p.includes('உரம்') || p.includes('நோய்') || p.includes('விவசாயம்') || p.includes('ஆர்கானிக்')) {
      return `🌱 **கிசான்மித்ரா பயிர் பாதுகாப்பு & இயற்கை விவசாய குறிப்புகள்**:\n\n1. **இயற்கை பூச்சி விரட்டி**: 5% வேப்பங்கொட்டை கரைசல் (NSKE) அல்லது வேப்பெண்ணெய் கரைசல் (லிட்டருக்கு 3-5 மி.லி) 10-14 நாட்களுக்கு ஒருமுறை தெளிக்கவும்.\n2. **மண் வளம்**: மக்கிய தொழு உரம் அல்லது மண்புழு உரம் (ஏக்கருக்கு 2-3 டன்) மற்றும் *ட்ரைக்கோடெர்மா விரிடி* பயன்படுத்தி வேரழுகல் நோய்களைத் தடுக்கலாம்.\n3. **நீர் மேலாண்மை**: சொட்டு நீர் பாசனம் அமைப்பதன் மூலம் 40% தண்ணீரை சேமிக்க முடியும்.`
    }
    return `🌿 **வணக்கம்! நான் கிசான்மித்ரா AI, உங்கள் விவசாய மற்றும் சந்தை ஆலோசகர்.**\n\nநான் உங்களுக்கு உதவக்கூடியவை:\n1. 📊 **மண்டி விலை vs பண்ணை விலை ஒப்பீடு**\n2. 🛒 **புதிய விளைபொருட்களை கண்டறிதல்**\n3. 🌾 **பயிர் பாதுகாப்பு மற்றும் இயற்கை உரங்கள்**\n4. 🛡️ **தரப் பரிசோதனை மற்றும் GI சான்றிதழ்**\n5. 📦 **ஆர்டர் விநியோக கண்காணிப்பு**\n\nஇன்று உங்கள் விவசாயத்திற்கு நான் எவ்வாறு உதவ முடியும்?`
  }

  // Telugu (తెలుగు)
  if (lang === 'te') {
    if (p.includes('mandi') || p.includes('ధర') || p.includes('rate') || p.includes('మండీ')) {
      const list = context.insights.map((i) => `• **${i.productName}**: మండీ ధర: ₹${i.marketPrice}/${i.unit} vs కిసాన్‌కనెక్ట్: ₹${i.platformPrice}/${i.unit} (ఆదా ₹${(i.marketPrice - i.platformPrice).toFixed(2)})`).join('\n')
      return `🌾 **నిజ-సమయ APMC మండీ ధరల విశ్లేషణ**:\n\nస్థానిక మండీ ధరలతో పోలిస్తే రైతు ప్రత్యక్ష ధరలు:\n\n${list || '• టమోటా: మండీ ₹45/kg vs కిసాన్‌కనెక్ట్ ₹35/kg'}\n\n💡 *గమనిక: దళారులు లేకుండా కొనుగోలు చేయడం ద్వారా 15–30% వరకు ఆదా చేసుకోవచ్చు!*`
    }
    return `🌿 **నమస్కారం! నేను కిసాన్‌మిత్ర AI, మీ వ్యవసాయ మరియు మార్కెట్ సహాయకుడిని.**\n\nనేను మీకు సహాయం చేయగలను:\n1. 📊 **మండీ ధరల పోలిక మరియు ఆదా వివరాలు**\n2. 🛒 **తాజా పంట ఉత్పత్తులను కనుగొనడం**\n3. 🌱 **సేంద్రీయ ఎరువులు మరియు తెగుళ్ల నివారణ**\n4. 📦 **ఆర్డర్ ట్రాకింగ్ వివరాలు**\n\nఈరోజు మీ వ్యవసాయానికి నేను ఎలా సహాయపడగలను?`
  }

  // Kannada (ಕನ್ನಡ)
  if (lang === 'kn') {
    if (p.includes('mandi') || p.includes('ಬೆಲೆ') || p.includes('ದರ') || p.includes('ಮಂಡಿ')) {
      const list = context.insights.map((i) => `• **${i.productName}**: ಮಂಡಿ ದರ: ₹${i.marketPrice}/${i.unit} vs ಕಿಸಾನ್ ಕನೆಕ್ಟ್: ₹${i.platformPrice}/${i.unit} (ಉಳಿತಾಯ ₹${(i.marketPrice - i.platformPrice).toFixed(2)})`).join('\n')
      return `🌾 **ನೈಜ-ಸಮಯದ APMC ಮಂಡಿ ದರ ಮಾಹಿತಿ**:\n\nಸ್ಥಳೀಯ ಮಂಡಿ ದರಗಳೊಂದಿಗೆ ರೈತರ ನೇರ ಬೆಲೆಗಳ ಹೋಲಿಕೆ:\n\n${list || '• ಟೊಮೆಟೊ: ಮಂಡಿ ₹45/kg vs ಕಿಸಾನ್ ಕನೆಕ್ಟ್ ₹35/kg'}\n\n💡 *ಸಲಹೆ: ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಖರೀದಿಸಿ 15–30% ಉಳಿತಾಯ ಮಾಡಿ!*`
    }
    return `🌿 **ನಮಸ್ಕಾರ! ನಾನು ಕಿಸಾನ್‌ಮಿತ್ರ AI, ನಿಮ್ಮ ಕೃಷಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಸಲಹೆಗಾರ.**\n\nನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n1. 📊 **ಮಂಡಿ ದರ ಮತ್ತು ನೇರ ಬೆಲೆಗಳ ಹೋಲಿಕೆ**\n2. 🛒 **ತಾಜಾ ಕೃಷಿ ಬೆಳೆಗಳ ಹುಡುಕಾಟ**\n3. 🌱 **ಸಾವಯವ ಕೀಟ ನಿಯಂತ್ರಣ ಮತ್ತು ಗೊಬ್ಬರ ಸಲಹೆಗಳು**\n4. 📦 **ಆರ್ಡರ್ ಡೆಲಿವರಿ ಟ್ರ್ಯಾಕಿಂಗ್**\n\nಇಂದು ನಿಮ್ಮ ಕೃಷಿಗೆ ನಾನು ಹೇಗೆ ನೆರವಾಗಲಿ?`
  }

  // Hindi (हिन्दी)
  if (lang === 'hi') {
    if (p.includes('mandi') || p.includes('भाव') || p.includes('दाम') || p.includes('रेट')) {
      const list = context.insights.map((i) => `• **${i.productName}**: मंडी भाव: ₹${i.marketPrice}/${i.unit} vs किसानकनेक्ट: ₹${i.platformPrice}/${i.unit} (बचत ₹${(i.marketPrice - i.platformPrice).toFixed(2)})`).join('\n')
      return `🌾 **लाइव APMC मंडी भाव तुलना**:\n\nस्थानीय मंडी भाव और किसानकनेक्ट के प्रत्यक्ष खेत भाव की तुलना:\n\n${list || '• टमाटर: मंडी ₹45/kg vs किसानकनेक्ट ₹35/kg'}\n\n💡 *सलाह: बिना बिचौलियों के सीधे खरीद पर 15–30% तक की सीधी बचत करें!*`
    }
    return `🌿 **नमस्ते! मैं किसानमित्र AI हूँ, आपका कृषि एवं मंडी सहायक।**\n\nमैं आपकी सहायता कर सकता हूँ:\n1. 📊 **मंडी भाव तुलना और बचत विश्लेषण**\n2. 🛒 **ताजा फसलों की सीधी खरीद**\n3. 🌱 **जैविक कीट नियंत्रण और उर्वरक सलाह**\n4. 📦 **ऑर्डर डिलीवरी और लाइव ट्रैकिंग**\n\nआज आपकी क्या सहायता करूँ?`
  }

  // Default: English
  if (p.includes('mandi') || p.includes('price') || p.includes('rate') || p.includes('benchmark')) {
    const list = context.insights.map((i) => `• **${i.productName}**: Mandi Rate: ₹${i.marketPrice}/${i.unit} vs KisanConnect Direct: ₹${i.platformPrice}/${i.unit} (Save ₹${(i.marketPrice - i.platformPrice).toFixed(2)})`).join('\n')
    return `🌾 **Live APMC Mandi Price Intelligence**:\n\nHere are current benchmark rates compared to direct KisanConnect farm prices:\n\n${list || '• Tomatoes: Mandi ₹45/kg vs KisanConnect ₹40/kg\n• Wheat: Mandi ₹35/kg vs KisanConnect ₹28/kg'}\n\n💡 *Tip: On KisanConnect, buyers save an average of 15–25% by purchasing directly from verified farmers without middleman markups!*`
  }

  if (p.includes('buy') || p.includes('product') || p.includes('produce') || p.includes('tomato') || p.includes('wheat') || p.includes('onion') || p.includes('potato') || p.includes('available')) {
    const prods = context.products.slice(0, 4).map((pr) => `• **${pr.name}** (${pr.category}): ₹${pr.price}/${pr.unit} • Stock: ${pr.quantity} ${pr.unit} • Location: ${pr.location || 'Local Farm'}`).join('\n')
    return `🛒 **Fresh Produce Currently Available on KisanConnect**:\n\n${prods || '• Organic Roma Tomatoes: ₹40/kg\n• Golden Sharbati Wheat: ₹28/kg\n• Red Nashik Onions: ₹32/kg'}\n\n👉 You can browse all crops on the **[Marketplace](/marketplace)** page.`
  }

  if (p.includes('pest') || p.includes('disease') || p.includes('fertilizer') || p.includes('organic') || p.includes('grow') || p.includes('crop')) {
    return `🌱 **KisanMitra Crop Advisory & Soil Health Tips**:\n\n1. **Organic Pest Management**: Use Neem seed kernel extract (NSKE 5%) or Neem oil spray (3-5 ml/liter water) every 10–14 days for aphids and fruit borers.\n2. **Soil Enrichment**: Incorporate well-decomposed FYM or Vermicompost (2–3 tons/acre) with *Trichoderma viride*.\n3. **Water Management**: Drip irrigation conserves 40% soil moisture and reduces weed pressure.`
  }

  return `🌿 **Namaste! I am KisanMitra AI, your agricultural & market assistant.**\n\nI can help you with:\n1. 📊 **APMC Mandi vs Farm Price Comparisons**\n2. 🛒 **Marketplace Produce Discovery**\n3. 🌾 **Crop Health & Pest Advisory**\n4. 🛡️ **Produce Quality & GI Verification**\n5. 📦 **Order Logistics & Tracking**\n\nHow may I assist your agricultural journey today?`
}

// @desc    Process AI Chat message with multi-language support (English, Tamil, Telugu, Kannada, Hindi, Marathi)
// @route   POST /api/chat
export const handleAIChat = async (req, res) => {
  try {
    const { message, language = 'en' } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message for the AI assistant.',
      })
    }

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

    const languageNames = {
      en: 'English',
      ta: 'Tamil (தமிழ்)',
      te: 'Telugu (తెలుగు)',
      kn: 'Kannada (ಕನ್ನಡ)',
      hi: 'Hindi (हिन्दी)',
      mr: 'Marathi (मराठी)',
    }
    const requestedLangName = languageNames[language] || 'English'

    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey })

        const systemInstruction = `You are "KisanMitra AI" (किसान मित्र), the expert agricultural and marketplace AI assistant for KisanConnect.
You specialize in Indian agriculture, crop advisory, organic farming, APMC wholesale Mandi price benchmarks, and platform navigation.

IMPORTANT MULTILINGUAL INSTRUCTION:
- The user is conversing in: ${requestedLangName} (Language code: ${language}).
- Please respond natively in ${requestedLangName} with proper agricultural terminology in that script.

Platform Grounding Context:
- Active Crops: ${JSON.stringify(recentProducts)}
- Live Mandi Benchmarks: ${JSON.stringify(priceInsights)}
- User: ${userName} (Role: ${userRole})

Goals:
1. Provide accurate organic farming & pest control advice.
2. Compare direct farm prices with APMC Mandi rates to highlight direct savings.
3. Help navigate marketplace crops, quality verification, and live logistics tracking.
4. Keep responses friendly, structured with bullet points and bold highlights.`

        const response = await ai.interactions.create({
          model: 'gemini-3.6-flash',
          input: message,
          system_instruction: systemInstruction,
        })

        const replyText = response.output_text || response.text || generateLocalFallback(message, dbContext, language)

        return res.json({
          success: true,
          data: {
            reply: replyText,
            language,
            source: 'gemini-3.6-flash',
            timestamp: new Date().toISOString(),
          },
        })
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using local engine:', geminiErr.message)
      }
    }

    const fallbackReply = generateLocalFallback(message, dbContext, language)
    return res.json({
      success: true,
      data: {
        reply: fallbackReply,
        language,
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
