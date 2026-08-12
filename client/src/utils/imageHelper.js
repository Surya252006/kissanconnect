export const getProductImageUrl = (image, name = '', category = '') => {
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:') || image.startsWith('/')) {
      return image
    }
    if (image.includes('.')) {
      return `/products/${image}`
    }
    return `/products/${image}.jpg`
  }

  const nameLower = name.toLowerCase()
  const categoryLower = category.toLowerCase()

  // 1. Peas & Pulses
  if (nameLower.includes('pea') || nameLower.includes('matar')) return '/products/peas.jpg'
  if (nameLower.includes('chana') || nameLower.includes('chickpea') || nameLower.includes('gram') || nameLower.includes('dal') || nameLower.includes('rajma') || nameLower.includes('lentil') || nameLower.includes('moong') || nameLower.includes('toor') || nameLower.includes('urad') || nameLower.includes('lobia') || nameLower.includes('kollu')) {
    return '/products/chickpeas.jpg'
  }

  // 2. Leafy Greens & Herbs
  if (nameLower.includes('spinach') || nameLower.includes('palak') || nameLower.includes('greens') || nameLower.includes('coriander') || nameLower.includes('dhaniya') || nameLower.includes('mint') || nameLower.includes('pudina') || nameLower.includes('methi') || nameLower.includes('curry') || nameLower.includes('saag') || nameLower.includes('keerai') || nameLower.includes('moringa') || nameLower.includes('leaf') || nameLower.includes('shepu') || nameLower.includes('gongura')) {
    return '/products/greens.jpg'
  }

  // 3. Vegetables
  if (nameLower.includes('tomato')) return '/products/tomato.jpg'
  if (nameLower.includes('potato') || nameLower.includes('aloo')) return '/products/potato.jpg'
  if (nameLower.includes('onion') || nameLower.includes('pyaz')) return '/products/onion.jpg'
  if (nameLower.includes('brinjal') || nameLower.includes('eggplant') || nameLower.includes('baingan')) return '/products/brinjal.jpg'
  if (nameLower.includes('carrot') || nameLower.includes('gajar')) return '/products/carrot.jpg'
  if (nameLower.includes('chilli') || nameLower.includes('chili') || nameLower.includes('mirch') || nameLower.includes('capsicum')) return '/products/chilli.jpg'
  if (nameLower.includes('cabbage') || nameLower.includes('cauliflower') || nameLower.includes('gobi') || nameLower.includes('okra') || nameLower.includes('bhindi') || nameLower.includes('karela') || nameLower.includes('gourd')) {
    return '/products/vegetables.jpg'
  }

  // 4. Fruits
  if (nameLower.includes('banana') || nameLower.includes('kela')) return '/products/banana.jpg'
  if (nameLower.includes('apple') || nameLower.includes('seb') || nameLower.includes('pomegranate') || nameLower.includes('anar') || nameLower.includes('orange') || nameLower.includes('guava') || nameLower.includes('grape') || nameLower.includes('watermelon') || nameLower.includes('papaya') || nameLower.includes('pineapple')) {
    return '/products/apple.jpg'
  }
  if (nameLower.includes('mango') || nameLower.includes('aam')) return '/products/mango.jpg'

  // 5. Grains & Spices
  if (nameLower.includes('rice') || nameLower.includes('paddy') || nameLower.includes('basmati')) return '/products/rice.jpg'
  if (nameLower.includes('wheat') || nameLower.includes('atta') || nameLower.includes('grain')) return '/products/wheat.jpg'
  if (nameLower.includes('turmeric') || nameLower.includes('haldi') || nameLower.includes('spice') || nameLower.includes('pepper') || nameLower.includes('cardamom')) return '/products/turmeric.jpg'

  // Category fallback
  if (categoryLower.includes('fruit')) return '/products/apple.jpg'
  if (categoryLower.includes('grain')) return '/products/wheat.jpg'
  if (categoryLower.includes('pulse')) return '/products/chickpeas.jpg'
  if (categoryLower.includes('spice')) return '/products/turmeric.jpg'

  return '/products/tomato.jpg'
}
