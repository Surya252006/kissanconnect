import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes — verifies the Bearer token and attaches req.user
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // 1. Confirm Bearer token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const token = authHeader.split(' ')[1]

    // 2. Verify JWT
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    // 3. Find the user in MongoDB
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    // 4. Attach user to request and continue
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}