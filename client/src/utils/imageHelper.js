export const getProductImageUrl = (image, name = '', category = '') => {
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:') || image.startsWith('/')) {
      return image
    }
    // If it's a filename like "tomato.jpg" or "tomato"
    if (image.includes('.')) {
      return `/products/${image}`
    }
    return `/products/${image}.jpg`
  }

  // Fallback map based on name/category
  const nameLower = name.toLowerCase()
  const categoryLower = category.toLowerCase()

  if (nameLower.includes('tomato')) return '/products/tomato.jpg'
  if (nameLower.includes('potato')) return '/products/potato.jpg'
  if (nameLower.includes('onion')) return '/products/onion.jpg'
  if (nameLower.includes('banana')) return '/products/banana.jpg'
  if (nameLower.includes('apple')) return '/products/apple.jpg'
  if (nameLower.includes('brinjal') || nameLower.includes('eggplant')) return '/products/brinjal.jpg'
  if (nameLower.includes('carrot')) return '/products/carrot.jpg'
  if (nameLower.includes('chickpea') || nameLower.includes('pulse')) return '/products/chickpeas.jpg'
  if (nameLower.includes('chilli') || nameLower.includes('chili')) return '/products/chilli.jpg'
  if (nameLower.includes('spinach') || nameLower.includes('greens') || nameLower.includes('leaf')) return '/products/greens.jpg'
  if (nameLower.includes('mango')) return '/products/mango.jpg'
  if (nameLower.includes('rice') || nameLower.includes('paddy')) return '/products/rice.jpg'
  if (nameLower.includes('turmeric') || nameLower.includes('spice')) return '/products/turmeric.jpg'
  if (nameLower.includes('wheat') || nameLower.includes('grain')) return '/products/wheat.jpg'

  if (categoryLower.includes('fruit')) return '/products/apple.jpg'
  if (categoryLower.includes('grain')) return '/products/wheat.jpg'
  if (categoryLower.includes('pulse')) return '/products/chickpeas.jpg'
  if (categoryLower.includes('spice')) return '/products/turmeric.jpg'

  return '/products/vegetables.jpg' // Default fallback
}
