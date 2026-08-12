import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Product from '../models/Product.js'
import PriceInsight from '../models/PriceInsight.js'

dotenv.config()
dotenv.config({ path: './server/.env' })
dotenv.config({ path: '../.env' })

const CROPS = [
  // 🥦 1. VEGETABLES (10 Types)
  {
    name: 'Organic Roma Field Tomatoes',
    category: 'Vegetables',
    price: 35,
    unit: 'kg',
    quantity: 850,
    location: 'Coimbatore, Tamil Nadu',
    image: '/products/tomato.jpg',
    description: 'Juicy, sun-ripened organic Roma tomatoes grown with vermicompost and zero synthetic pesticides. High in Lycopene.',
    isVerified: true,
  },
  {
    name: 'Red Nashik Onions',
    category: 'Vegetables',
    price: 25,
    unit: 'kg',
    quantity: 1200,
    location: 'Nashik Valley, Maharashtra',
    image: '/products/onion.jpg',
    description: 'Crisp, pungent Grade-A Nashik red onions with extended shelf life and low moisture content.',
    isVerified: true,
  },
  {
    name: 'Pahari Round Potatoes',
    category: 'Vegetables',
    price: 22,
    unit: 'kg',
    quantity: 1500,
    location: 'Shimla, Himachal Pradesh',
    image: '/products/potato.jpg',
    description: 'Mountain-harvested high-starch potatoes, ideal for frying, baking, and curries.',
    isVerified: true,
  },
  {
    name: 'Ooty Sweet Red Carrots',
    category: 'Vegetables',
    price: 45,
    unit: 'kg',
    quantity: 600,
    location: 'Nilgiris (Ooty), Tamil Nadu',
    image: '/products/carrot.jpg',
    description: 'Crunchy, sweet highland carrots rich in Beta-Carotene harvested from cool mountain slopes.',
    isVerified: true,
  },
  {
    name: 'Purple Round Brinjal (Baingan)',
    category: 'Vegetables',
    price: 30,
    unit: 'kg',
    quantity: 400,
    location: 'Mysuru, Karnataka',
    image: '/products/brinjal.jpg',
    description: 'Glossy, tender purple eggplants perfect for roasting, bharta, and sambar.',
    isVerified: true,
  },
  {
    name: 'Snowball White Cauliflower',
    category: 'Vegetables',
    price: 28,
    unit: 'kg',
    quantity: 500,
    location: 'Pune, Maharashtra',
    image: '/products/tomato.jpg',
    description: 'Tightly packed, pesticide-tested creamy white cauliflower heads harvested at dawn.',
    isVerified: false,
  },
  {
    name: 'Crisp Green Leaf Cabbage',
    category: 'Vegetables',
    price: 20,
    unit: 'kg',
    quantity: 750,
    location: 'Belagavi, Karnataka',
    image: '/products/tomato.jpg',
    description: 'Fresh, firm green cabbage heads with sweet, crispy layers.',
    isVerified: true,
  },
  {
    name: 'Tender Green Okra (Bhindi)',
    category: 'Vegetables',
    price: 40,
    unit: 'kg',
    quantity: 350,
    location: 'Warangal, Telangana',
    image: '/products/chilli.jpg',
    description: 'Small, fiber-less tender ladyfingers harvested daily for maximum tenderness.',
    isVerified: true,
  },
  {
    name: 'Green Bell Capsicum',
    category: 'Vegetables',
    price: 55,
    unit: 'kg',
    quantity: 450,
    location: 'Hosur, Tamil Nadu',
    image: '/products/chilli.jpg',
    description: 'Greenhouse-grown crunchy bell peppers with thick juicy walls.',
    isVerified: true,
  },
  {
    name: 'Organic Bitter Gourd (Karela)',
    category: 'Vegetables',
    price: 38,
    unit: 'kg',
    quantity: 300,
    location: 'Madurai, Tamil Nadu',
    image: '/products/brinjal.jpg',
    description: 'Traditional dark green bitter gourd rich in natural charantin and dietary antioxidants.',
    isVerified: false,
  },

  // 🍎 2. FRUITS (10 Types)
  {
    name: 'Ratnagiri Alphonso Mangoes (GI Tag)',
    category: 'Fruits',
    price: 120,
    unit: 'kg',
    quantity: 500,
    location: 'Ratnagiri, Maharashtra',
    image: '/products/mango.jpg',
    description: 'Authentic GI-certified Devgad/Ratnagiri Alphonso (Hapus) mangoes with heavenly aroma and golden pulp.',
    isVerified: true,
  },
  {
    name: 'Yelakki Sweet Bananas',
    category: 'Fruits',
    price: 48,
    unit: 'dozen',
    quantity: 600,
    location: 'Tiruchirappalli, Tamil Nadu',
    image: '/products/banana.jpg',
    description: 'Small, aromatic sweet bananas grown along the Cauvery delta riverbed.',
    isVerified: true,
  },
  {
    name: 'Kashmiri Royal Delicious Apples',
    category: 'Fruits',
    price: 110,
    unit: 'kg',
    quantity: 800,
    location: 'Shopian, Jammu & Kashmir',
    image: '/products/apple.jpg',
    description: 'High-altitude crisp red apples with natural sweetness and aromatic crunch.',
    isVerified: true,
  },
  {
    name: 'Solapur Bhagwa Pomegranates',
    category: 'Fruits',
    price: 95,
    unit: 'kg',
    quantity: 450,
    location: 'Solapur, Maharashtra',
    image: '/products/apple.jpg',
    description: 'Ruby-red juicy arils with soft seeds, packed with immunity-boosting antioxidants.',
    isVerified: true,
  },
  {
    name: 'Allahabad Safeda Sweet Guava',
    category: 'Fruits',
    price: 42,
    unit: 'kg',
    quantity: 380,
    location: 'Prayagraj, Uttar Pradesh',
    image: '/products/apple.jpg',
    description: 'Smooth-skinned white-flesh guavas famous for their pleasant aroma and high Vitamin C.',
    isVerified: true,
  },
  {
    name: 'Red Lady Sweet Papaya',
    category: 'Fruits',
    price: 32,
    unit: 'kg',
    quantity: 550,
    location: 'Anantapur, Andhra Pradesh',
    image: '/products/mango.jpg',
    description: 'Farm-fresh Taiwanese Red Lady papayas with deep orange-red sweet flesh.',
    isVerified: true,
  },
  {
    name: 'Nagpur Mandarin Oranges',
    category: 'Fruits',
    price: 65,
    unit: 'kg',
    quantity: 700,
    location: 'Nagpur, Maharashtra',
    image: '/products/apple.jpg',
    description: 'Famous juicy sweet-tangy Nagpur oranges with easily peelable rinds.',
    isVerified: true,
  },
  {
    name: 'Nashik Green Seedless Grapes',
    category: 'Fruits',
    price: 75,
    unit: 'kg',
    quantity: 600,
    location: 'Nashik, Maharashtra',
    image: '/products/apple.jpg',
    description: 'Export-grade Thompson seedless green grapes with refreshing sweetness.',
    isVerified: true,
  },
  {
    name: 'Kiran Sweet Striped Watermelon',
    category: 'Fruits',
    price: 18,
    unit: 'kg',
    quantity: 1200,
    location: 'Villupuram, Tamil Nadu',
    image: '/products/apple.jpg',
    description: 'Deep red, crisp watermelons with 12% brix sugar content and high hydration.',
    isVerified: false,
  },
  {
    name: 'Vazhakulam Queen Pineapple (GI Tag)',
    category: 'Fruits',
    price: 50,
    unit: 'piece',
    quantity: 400,
    location: 'Vazhakulam, Kerala',
    image: '/products/mango.jpg',
    description: 'GI-tagged aromatic Queen pineapples with crisp golden flesh and pleasant acidity.',
    isVerified: true,
  },

  // 🌿 3. GREENS & LEAFY HERBS (10 Types)
  {
    name: 'Organic Tender Spinach (Palak Keerai)',
    category: 'Vegetables',
    price: 25,
    unit: 'kg',
    quantity: 500,
    location: 'Coimbatore, Tamil Nadu',
    image: '/products/greens.jpg',
    description: 'Farm-fresh tender dark green spinach rich in iron, folic acid, and vitamins.',
    isVerified: true,
  },
  {
    name: 'Aromatic Fresh Coriander Leaves (Dhaniya)',
    category: 'Vegetables',
    price: 35,
    unit: 'kg',
    quantity: 400,
    location: 'Kolar, Karnataka',
    image: '/products/greens.jpg',
    description: 'Deeply fragrant coriander leaves with tender stems, freshly picked at sunrise.',
    isVerified: true,
  },
  {
    name: 'Fresh Garden Mint Leaves (Pudina)',
    category: 'Vegetables',
    price: 40,
    unit: 'kg',
    quantity: 300,
    location: 'Pune, Maharashtra',
    image: '/products/greens.jpg',
    description: 'Refreshing aromatic spearmint leaves ideal for chutneys, beverages, and seasonings.',
    isVerified: true,
  },
  {
    name: 'Kasuri Fenugreek Leaves (Methi)',
    category: 'Vegetables',
    price: 38,
    unit: 'kg',
    quantity: 350,
    location: 'Nagaur, Rajasthan',
    image: '/products/greens.jpg',
    description: 'Small-leaf fragrant methi greens packed with digestion-friendly dietary fiber.',
    isVerified: true,
  },
  {
    name: 'Fresh Green Curry Leaves (Kadi Patta)',
    category: 'Vegetables',
    price: 45,
    unit: 'kg',
    quantity: 500,
    location: 'Karur, Tamil Nadu',
    image: '/products/greens.jpg',
    description: 'Essential South Indian culinary herb with high essential oil aroma.',
    isVerified: true,
  },
  {
    name: 'Mustard Greens (Sarson Saag)',
    category: 'Vegetables',
    price: 30,
    unit: 'kg',
    quantity: 350,
    location: 'Ludhiana, Punjab',
    image: '/products/greens.jpg',
    description: 'Traditional winter mustard greens with sharp, peppery taste for authentic Sarson Ka Saag.',
    isVerified: true,
  },
  {
    name: 'Red Amaranth Greens (Thandu Keerai)',
    category: 'Vegetables',
    price: 28,
    unit: 'kg',
    quantity: 300,
    location: 'Thanjavur, Tamil Nadu',
    image: '/products/greens.jpg',
    description: 'Vibrant red-stem amaranth leaves loaded with calcium, potassium, and antioxidants.',
    isVerified: false,
  },
  {
    name: 'Organic Moringa Leaves (Murungai Keerai)',
    category: 'Vegetables',
    price: 50,
    unit: 'kg',
    quantity: 320,
    location: 'Dindigul, Tamil Nadu',
    image: '/products/greens.jpg',
    description: 'Superfood moringa leaves harvested from pesticide-free trees, packed with plant protein.',
    isVerified: true,
  },
  {
    name: 'Fresh Dill Leaves (Shepu / Suva)',
    category: 'Vegetables',
    price: 32,
    unit: 'kg',
    quantity: 250,
    location: 'Nashik, Maharashtra',
    image: '/products/greens.jpg',
    description: 'Feathery aromatic dill leaves used in traditional digestive dal and stir-fries.',
    isVerified: false,
  },
  {
    name: 'Tangy Andhra Sorrel Leaves (Gongura)',
    category: 'Vegetables',
    price: 30,
    unit: 'kg',
    quantity: 400,
    location: 'Guntur, Andhra Pradesh',
    image: '/products/greens.jpg',
    description: 'Authentic red-stem tangy sorrel leaves famous for Gongura Pachadi and curries.',
    isVerified: true,
  },

  // 🫘 4. PEAS & PULSES / LEGUMES (10 Types)
  {
    name: 'Fresh Sweet Green Peas (Matar)',
    category: 'Pulses',
    price: 60,
    unit: 'kg',
    quantity: 650,
    location: 'Jabalpur, Madhya Pradesh',
    image: '/products/peas.jpg',
    description: 'Farm-fresh sweet green peas in crisp tender pods, ready for shelling and cooking.',
    isVerified: true,
  },
  {
    name: 'Organic White Kabuli Chickpeas',
    category: 'Pulses',
    price: 90,
    unit: 'kg',
    quantity: 800,
    location: 'Indore, Madhya Pradesh',
    image: '/products/chickpeas.jpg',
    description: 'Large-grain premium white chickpeas with soft, creamy texture after boiling.',
    isVerified: true,
  },
  {
    name: 'Desi Brown Chickpeas (Kala Chana)',
    category: 'Pulses',
    price: 68,
    unit: 'kg',
    quantity: 900,
    location: 'Bikaner, Rajasthan',
    image: '/products/chickpeas.jpg',
    description: 'High-protein, fiber-rich native brown chickpeas for sprouting and curry.',
    isVerified: true,
  },
  {
    name: 'Organic Whole Green Gram (Moong)',
    category: 'Pulses',
    price: 95,
    unit: 'kg',
    quantity: 700,
    location: 'Gulbarga, Karnataka',
    image: '/products/chickpeas.jpg',
    description: 'Unpolished whole green moong beans ideal for healthy sprouting and soups.',
    isVerified: true,
  },
  {
    name: 'Unpolished Desi Pigeon Peas (Toor Dal)',
    category: 'Pulses',
    price: 130,
    unit: 'kg',
    quantity: 1100,
    location: 'Latur, Maharashtra',
    image: '/products/chickpeas.jpg',
    description: 'Sun-dried unpolished toor dal without oil coating, cooking faster with authentic aroma.',
    isVerified: true,
  },
  {
    name: 'Guntur Whole Black Gram (Urad)',
    category: 'Pulses',
    price: 115,
    unit: 'kg',
    quantity: 650,
    location: 'Guntur, Andhra Pradesh',
    image: '/products/chickpeas.jpg',
    description: 'High-elasticity black urad dal perfect for fluffy idlis, dosas, and vadas.',
    isVerified: true,
  },
  {
    name: 'Split Red Lentils (Masoor Dal)',
    category: 'Pulses',
    price: 85,
    unit: 'kg',
    quantity: 750,
    location: 'Patna, Bihar',
    image: '/products/chickpeas.jpg',
    description: 'Quick-cooking split red lentils rich in plant-based iron and protein.',
    isVerified: true,
  },
  {
    name: 'Organic White Cowpeas (Lobia)',
    category: 'Pulses',
    price: 78,
    unit: 'kg',
    quantity: 500,
    location: 'Salem, Tamil Nadu',
    image: '/products/chickpeas.jpg',
    description: 'Nutritious black-eyed peas with buttery texture and high mineral content.',
    isVerified: false,
  },
  {
    name: 'Jammu Red Kidney Beans (Rajma)',
    category: 'Pulses',
    price: 140,
    unit: 'kg',
    quantity: 600,
    location: 'Bhaderwah, Jammu & Kashmir',
    image: '/products/chickpeas.jpg',
    description: 'World-famous small red Kashmiri Chitra rajma that melts in the mouth.',
    isVerified: true,
  },
  {
    name: 'Nutrient-Dense Horse Gram (Kollu / Kulthi)',
    category: 'Pulses',
    price: 70,
    unit: 'kg',
    quantity: 450,
    location: 'Dharmapuri, Tamil Nadu',
    image: '/products/chickpeas.jpg',
    description: 'Traditional super-pulse high in iron and protein, widely used for healthy rasam and soups.',
    isVerified: true,
  },
]

async function seedFullCatalog() {
  try {
    const MONGO_URI = process.env.MONGO_URI
    if (!MONGO_URI) {
      console.error('MONGO_URI is missing in .env')
      process.exit(1)
    }

    await mongoose.connect(MONGO_URI)
    console.log('Connected to MongoDB')

    // Find farmer user
    let farmer = await User.findOne({ role: 'FARMER' })
    if (!farmer) {
      farmer = await User.create({
        name: 'Ramesh Patel (Lead Farmer)',
        email: 'farmer.demo@kissanconnect.in',
        password: 'DemoPass123!',
        role: 'FARMER',
        phone: '9876543210',
        location: 'Coimbatore, Tamil Nadu',
        isVerified: true,
      })
      console.log('Created default farmer account')
    }

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert 40 full crops
    const productDocs = CROPS.map((c) => ({
      ...c,
      farmerId: farmer._id,
    }))

    const inserted = await Product.insertMany(productDocs)
    console.log(`Successfully seeded ${inserted.length} diverse agricultural crops!`)

    // Seed matching APMC Mandi Price Insights
    await PriceInsight.deleteMany({})
    const priceDocs = [
      { productName: 'Roma Field Tomatoes', category: 'Vegetables', marketPrice: 45, platformPrice: 35, unit: 'kg', location: 'Coimbatore Mandi', trend: 'DOWN' },
      { productName: 'Red Nashik Onions', category: 'Vegetables', marketPrice: 35, platformPrice: 25, unit: 'kg', location: 'Lasalgaon Mandi', trend: 'STABLE' },
      { productName: 'Pahari Potatoes', category: 'Vegetables', marketPrice: 30, platformPrice: 22, unit: 'kg', location: 'Shimla Mandi', trend: 'STABLE' },
      { productName: 'Sweet Red Carrots', category: 'Vegetables', marketPrice: 60, platformPrice: 45, unit: 'kg', location: 'Mettupalayam Mandi', trend: 'UP' },
      { productName: 'Alphonso Mangoes', category: 'Fruits', marketPrice: 160, platformPrice: 120, unit: 'kg', location: 'Vashi APMC', trend: 'UP' },
      { productName: 'Yelakki Bananas', category: 'Fruits', marketPrice: 65, platformPrice: 48, unit: 'dozen', location: 'Trichy Mandi', trend: 'STABLE' },
      { productName: 'Royal Delicious Apples', category: 'Fruits', marketPrice: 150, platformPrice: 110, unit: 'kg', location: 'Azadpur APMC', trend: 'UP' },
      { productName: 'Organic Spinach (Palak)', category: 'Vegetables', marketPrice: 35, platformPrice: 25, unit: 'kg', location: 'Koyambedu APMC', trend: 'STABLE' },
      { productName: 'Fresh Sweet Green Peas', category: 'Pulses', marketPrice: 85, platformPrice: 60, unit: 'kg', location: 'Jabalpur Mandi', trend: 'DOWN' },
      { productName: 'Unpolished Toor Dal', category: 'Pulses', marketPrice: 165, platformPrice: 130, unit: 'kg', location: 'Latur APMC', trend: 'UP' },
    ]
    await PriceInsight.insertMany(priceDocs)
    console.log(`Seeded ${priceDocs.length} matching APMC Mandi price benchmarks!`)

    process.exit(0)
  } catch (err) {
    console.error('Error seeding crops:', err)
    process.exit(1)
  }
}

seedFullCatalog()
