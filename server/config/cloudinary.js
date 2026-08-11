import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  )
}

/**
 * Uploads a file buffer or local file path to Cloudinary.
 * If Cloudinary credentials are missing or upload fails, falls back gracefully.
 */
export const uploadToCloudinary = async (file) => {
  if (!isCloudinaryConfigured()) {
    console.warn('Cloudinary credentials not configured. Skipping remote upload.')
    return null
  }

  try {
    if (file.buffer) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'kissanconnect/products',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error)
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            })
          }
        )
        stream.end(file.buffer)
      })
    } else if (file.path) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'kissanconnect/products',
      })
      return {
        url: result.secure_url,
        public_id: result.public_id,
      }
    }
    return null
  } catch (error) {
    console.error('Cloudinary upload error:', error.message)
    return null
  }
}

export default cloudinary
