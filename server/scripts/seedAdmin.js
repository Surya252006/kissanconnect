import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

dotenv.config()

const setupAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      console.error('MONGO_URI missing in .env')
      process.exit(1)
    }

    await mongoose.connect(mongoUri)
    console.log('MongoDB connected successfully...')

    const adminAccounts = [
      {
        email: 'admin.demo@kissanconnect.in',
        password: 'DemoPass123!',
        name: 'KisanConnect Admin',
        role: 'ADMIN',
        location: 'New Delhi',
        isVerified: true,
      },
      {
        email: 'admin@kissanconnect.in',
        password: 'admin123',
        name: 'Administrator',
        role: 'ADMIN',
        location: 'New Delhi',
        isVerified: true,
      },
      {
        email: 'admin@gmail.com',
        password: 'admin123',
        name: 'Platform Admin',
        role: 'ADMIN',
        location: 'New Delhi',
        isVerified: true,
      },
    ]

    for (const acc of adminAccounts) {
      const hashedPassword = await bcrypt.hash(acc.password, 10)
      const existing = await User.findOne({ email: acc.email.toLowerCase() })

      if (existing) {
        existing.password = hashedPassword
        existing.role = 'ADMIN'
        existing.isVerified = true
        existing.name = acc.name
        await existing.save()
        console.log(`✓ Updated existing admin account: ${acc.email} (Password: ${acc.password})`)
      } else {
        await User.create({
          name: acc.name,
          email: acc.email.toLowerCase(),
          password: hashedPassword,
          role: 'ADMIN',
          location: acc.location,
          isVerified: true,
        })
        console.log(`✓ Created new admin account: ${acc.email} (Password: ${acc.password})`)
      }
    }

    console.log('✅ All Admin credentials configured and verified in database!')
    process.exit(0)
  } catch (error) {
    console.error('Error setting up admin credentials:', error)
    process.exit(1)
  }
}

setupAdmin()
