import multer from 'multer'
import path from 'path'

// Memory storage for direct buffer handling (suitable for Cloudinary stream)
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  const ext = path.extname(file.originalname).toLowerCase()
  const mime = file.mimetype.toLowerCase()

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mime)) {
    cb(null, true)
  } else {
    cb(new Error('Unsupported file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'), false)
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
  fileFilter,
})

export default upload
