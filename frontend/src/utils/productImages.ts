// Product image mapping utility
import mixedMasalaImage from '../assets/product_images/mixed masala mockup.png';
import moringaImage from '../assets/product_images/moringa.png';
import nutriboxImage from '../assets/product_images/nutribox mockup.png';
import turmericImage from '../assets/product_images/turmeric .png';

// API Base URL for backend assets
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
 * Build full URL for backend asset paths
 */
const buildAssetUrl = (path: string): string => {
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // If it's a relative path starting with /assets, prepend API base URL
  if (path.startsWith('/assets')) {
    return `${API_BASE_URL}${path}`;
  }
  // If it starts with assets (without leading slash), add it
  if (path.startsWith('assets/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return path;
};

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
  
  // Fallback to database URL if available (with proper URL building)
  if (databaseImageUrl && databaseImageUrl.trim() !== '') {
    return buildAssetUrl(databaseImageUrl);
  }
  
  // Final fallback to default image
  return defaultProductImage;
};

/**
 * Export buildAssetUrl for use in other components
 */
export { buildAssetUrl };

export default {
  productImageMap,
  getProductImage,
  getProductImageWithFallback,
  buildAssetUrl
};