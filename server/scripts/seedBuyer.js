import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

dotenv.config()

const setupBuyers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      console.error('MONGO_URI missing in .env')
      process.exit(1)
    }

    await mongoose.connect(mongoUri)
    console.log('MongoDB connected successfully...')

    const buyerAccounts = [
      {
        email: 'buyer@kissanconnect.in',
        password: 'buyer123',
        name: 'Priya Sharma (Buyer)',
        role: 'CONSUMER',
        phone: '9876500001',
        location: 'Mumbai, Maharashtra',
      },
      {
        email: 'buyer@gmail.com',
        password: 'buyer123',
        name: 'Rahul Verma (Retail Buyer)',
        role: 'RETAILER',
        phone: '9876500002',
        location: 'Bengaluru, Karnataka',
      },
      {
        email: 'buyer.demo@kissanconnect.in',
        password: 'DemoPass123!',
        name: 'Anita Patel (Consumer)',
        role: 'CONSUMER',
        phone: '9876500003',
        location: 'Chennai, Tamil Nadu',
      },
    ]

    for (const acc of buyerAccounts) {
      const hashedPassword = await bcrypt.hash(acc.password, 10)
      const existing = await User.findOne({ email: acc.email.toLowerCase() })

      if (existing) {
        existing.password = hashedPassword
        existing.role = acc.role
        existing.name = acc.name
        await existing.save()
        console.log(`✓ Updated buyer account: ${acc.email} (Password: ${acc.password})`)
      } else {
        await User.create({
          name: acc.name,
          email: acc.email.toLowerCase(),
          password: hashedPassword,
          role: acc.role,
          phone: acc.phone,
          location: acc.location,
        })
        console.log(`✓ Created new buyer account: ${acc.email} (Password: ${acc.password})`)
      }
    }

    console.log('✅ All Buyer accounts configured successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error setting up buyer credentials:', error)
    process.exit(1)
  }
}

setupBuyers()
