import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Allowed roles for registration (ADMIN allowed only for local dev testing)
const ALLOWED_ROLES = ['FARMER', 'CONSUMER', 'RETAILER', 'WHOLESALER', 'ADMIN']
const EMAIL_REGEX = /^\S+@\S+\.\S+$/

// Generate a JWT for a user
const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, location } = req.body

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' })
    }
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' })
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
    }
    if (!role) {
      return res.status(400).json({ success: false, message: 'Role is required' })
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' })
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || undefined,
      role,
      location: location || undefined,
    })

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          isVerified: user.isVerified,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc   Login a user
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Generate token
    const token = generateToken(user)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          isVerified: user.isVerified,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc   Get current authenticated user
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    res.status(200).json({
      success: true,
      message: 'Current user retrieved',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

// @desc   Temporary protected test route (development only)
// @route  GET /api/auth/protected-test
// @access Private
export const protectedTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication is working',
    data: {
      userId: req.user._id,
      role: req.user.role,
    },
  })
}

// @desc   Temporary farmer-only test route (development only)
// @route  GET /api/auth/farmer-test
// @access Private (FARMER)
export const farmerTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Farmer access granted',
    data: {
      userId: req.user._id,
      role: req.user.role,
    },
  })
}

// @desc   Temporary admin-only test route (development only)
// @route  GET /api/auth/admin-test
// @access Private (ADMIN)
export const adminTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted',
    data: {
      userId: req.user._id,
      role: req.user.role,
    },
  })
}

// @desc   Temporary buyer test route (development only)
// @route  GET /api/auth/buyer-test
// @access Private (CONSUMER, RETAILER, WHOLESALER)
export const buyerTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Buyer access granted',
    data: {
      userId: req.user._id,
      role: req.user.role,
    },
  })
}