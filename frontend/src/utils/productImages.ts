// Product image mapping utility
import mixedMasalaImage from '../assets/product_images/mixed masala mockup.png';
import moringaImage from '../assets/product_images/moringa.png';
import nutriboxImage from '../assets/product_images/nutribox mockup.png';
import turmericImage from '../assets/product_images/turmeric .png';

// Map product IDs to frontend images
export const productImageMap: { [key: string]: string } = {
  "674551234567890123456789": mixedMasalaImage,  // Mixed Masala Blend
  "674551234567890123456790": moringaImage,      // Moringa Leaf Powder
  "674551234567890123456791": nutriboxImage,     // NutriBox Complete
  "674551234567890123456792": turmericImage,     // Turmeric Root Powder
};

// Fallback image for unknown products
const defaultProductImage = mixedMasalaImage;

/**
 * Get product image from frontend assets based on product ID
 * Falls back to default image if product ID not found
 */
export const getProductImage = (productId: string): string => {
  return productImageMap[productId] || defaultProductImage;
};

/**
 * Get product image with fallback chain: frontend map -> database URL -> default
 */
export const getProductImageWithFallback = (productId: string, databaseImageUrl?: string): string => {
  // First try frontend image mapping
  if (productImageMap[productId]) {
    return productImageMap[productId];
  }
  
  // Fallback to database URL if available
  if (databaseImageUrl && databaseImageUrl.trim() !== '') {
    return databaseImageUrl;
  }
  
  // Final fallback to default image
  return defaultProductImage;
};

export default {
  productImageMap,
  getProductImage,
  getProductImageWithFallback
};