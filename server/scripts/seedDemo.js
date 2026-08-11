import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Product from '../models/Product.js'
import PriceInsight from '../models/PriceInsight.js'

dotenv.config()

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      console.error('Error: MONGO_URI is not defined in environment.')
      process.exit(1)
    }

    await mongoose.connect(mongoUri)
    console.log('MongoDB connected for safe demo seeding...')

    // 1. Seed Demo Admin (if not present)
    let admin = await User.findOne({ email: 'admin.demo@kissanconnect.in' })
    if (!admin) {
      const hashedPassword = await bcrypt.hash('DemoPass123!', 10)
      admin = await User.create({
        name: 'KisanConnect Admin',
        email: 'admin.demo@kissanconnect.in',
        password: hashedPassword,
        role: 'ADMIN',
        location: 'New Delhi',
        isVerified: true,
      })
      console.log('✓ Created Demo Admin: admin.demo@kissanconnect.in')
    }

    // 2. Seed Demo Farmer (if not present)
    let farmer = await User.findOne({ email: 'farmer.demo@kissanconnect.in' })
    if (!farmer) {
      const hashedPassword = await bcrypt.hash('DemoPass123!', 10)
      farmer = await User.create({
        name: 'Ramesh Kumar (Organic Farmer)',
        email: 'farmer.demo@kissanconnect.in',
        password: hashedPassword,
        role: 'FARMER',
        phone: '9845012345',
        location: 'Nashik, Maharashtra',
        isVerified: true,
      })
      console.log('✓ Created Demo Farmer: farmer.demo@kissanconnect.in')
    }

    // 3. Seed Demo Buyer (if not present)
    let buyer = await User.findOne({ email: 'buyer.demo@kissanconnect.in' })
    if (!buyer) {
      const hashedPassword = await bcrypt.hash('DemoPass123!', 10)
      buyer = await User.create({
        name: 'Priya Sharma (Retail Buyer)',
        email: 'buyer.demo@kissanconnect.in',
        password: hashedPassword,
        role: 'CONSUMER',
        phone: '9812345678',
        location: 'Mumbai, Maharashtra',
      })
      console.log('✓ Created Demo Buyer: buyer.demo@kissanconnect.in')
    }

    // 4. Seed Demo Produce Listings (Idempotent: checked by name and farmerId)
    const demoProducts = [
      {
        name: 'Farm Fresh Hybrid Tomatoes',
        category: 'Vegetables',
        description: 'Vine-ripened, pesticide-free fresh tomatoes harvested this morning.',
        price: 38,
        quantity: 150,
        unit: 'kg',
        location: 'Nashik, Maharashtra',
        qualityStatus: 'Premium',
        isVerified: true,
      },
      {
        name: 'Crisp Shimla Royal Apples',
        category: 'Fruits',
        description: 'Naturally sweetened, handpicked organic Shimla mountain apples.',
        price: 130,
        quantity: 80,
        unit: 'kg',
        location: 'Shimla, Himachal Pradesh',
        qualityStatus: 'Premium',
        isVerified: true,
      },
      {
        name: 'Aromatic Sharbati Wheat',
        category: 'Grains',
        description: 'Traditional golden grain harvest with rich gluten content and aroma.',
        price: 45,
        quantity: 500,
        unit: 'kg',
        location: 'Sehore, Madhya Pradesh',
        qualityStatus: 'Good',
        isVerified: true,
      },
      {
        name: 'Organic Red Onions',
        category: 'Vegetables',
        description: 'Direct farm batch of pungent, well-cured Nashik red onions.',
        price: 32,
        quantity: 200,
        unit: 'kg',
        location: 'Lasalgaon, Maharashtra',
        qualityStatus: 'Good',
        isVerified: false,
      },
      {
        name: 'Salem Pure Turmeric Powder',
        category: 'Spices',
        description: 'High-curcumin content pure sun-dried farm ground turmeric.',
        price: 180,
        quantity: 60,
        unit: 'kg',
        location: 'Salem, Tamil Nadu',
        qualityStatus: 'Premium',
        isVerified: true,
      },
    ]

    for (const p of demoProducts) {
      const exists = await Product.findOne({ name: p.name, farmerId: farmer._id })
      if (!exists) {
        await Product.create({ ...p, farmerId: farmer._id })
        console.log(`✓ Seeded Product: ${p.name}`)
      }
    }

    // 5. Seed Price Insights Benchmarks (Idempotent: checked by productName)
    const demoInsights = [
      {
        productName: 'Farm Fresh Hybrid Tomatoes',
        category: 'Vegetables',
        marketPrice: 48,
        platformPrice: 38,
        unit: 'kg',
        location: 'Nashik APMC',
        trend: 'DOWN',
      },
      {
        productName: 'Crisp Shimla Royal Apples',
        category: 'Fruits',
        marketPrice: 160,
        platformPrice: 130,
        unit: 'kg',
        location: 'Azadpur Mandi, Delhi',
        trend: 'STABLE',
      },
      {
        productName: 'Organic Red Onions',
        category: 'Vegetables',
        marketPrice: 40,
        platformPrice: 32,
        unit: 'kg',
        location: 'Lasalgaon APMC',
        trend: 'UP',
      },
      {
        productName: 'Aromatic Sharbati Wheat',
        category: 'Grains',
        marketPrice: 52,
        platformPrice: 45,
        unit: 'kg',
        location: 'Indore Mandi',
        trend: 'STABLE',
      },
    ]

    for (const pi of demoInsights) {
      const exists = await PriceInsight.findOne({ productName: pi.productName })
      if (!exists) {
        await PriceInsight.create(pi)
        console.log(`✓ Seeded Price Benchmark: ${pi.productName}`)
      }
    }

    console.log('✅ Demo seeding completed safely and successfully without data loss.')
    process.exit(0)
  } catch (error) {
    console.error('Error during demo seed:', error)
    process.exit(1)
  }
}

seedData()
