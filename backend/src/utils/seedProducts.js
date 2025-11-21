import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

// Sample product data based on your frontend
const sampleProducts = [
  {
    name: "Mixed Masala Blend",
    slug: "mixed-masala",
    description: "Premium spice blend combining traditional Indian masalas for authentic flavor and health benefits",
    fullDescription: "Our Mixed Masala Blend is a carefully crafted combination of traditional Indian spices that not only enhance the flavor of your dishes but also provide numerous health benefits. Each spice is sourced from organic farms and ground fresh to preserve maximum potency and flavor.",
    price: 249,
    originalPrice: 299,
    images: [
      {
        url: "/assets/product_images/mixed masala mockup.png",
        alt: "Mixed Masala Blend",
        isPrimary: true
      }
    ],
    category: "masala",
    tags: ["organic", "traditional", "spice-blend", "healthy"],
    benefits: [
      "Rich in antioxidants and anti-inflammatory compounds",
      "Supports digestive health and metabolism",
      "100% organic and natural ingredients",
      "Authentic traditional recipe"
    ],
    ingredients: ["Cumin", "Coriander", "Turmeric", "Red Chili", "Garam Masala", "Fenugreek", "Mustard Seeds"],
    nutritionFacts: {
      servingSize: "1 teaspoon (5g)",
      calories: 15,
      protein: 0.5,
      carbs: 2.8,
      fat: 0.5,
      fiber: 1.2
    },
    inventory: {
      stock: 100,
      lowStockThreshold: 10,
      isAvailable: true
    },
    weight: { value: 100, unit: "g" },
    isFeatured: true,
    sortOrder: 1
  },
  {
    name: "Moringa Leaf Powder",
    slug: "moringa",
    description: "Nutrient-dense superfood powder from organic moringa leaves, packed with vitamins and minerals",
    fullDescription: "Known as the 'Tree of Life', our premium Moringa Leaf Powder is sourced from organically grown moringa trees. This superfood contains all essential amino acids, vitamins A, C, and E, calcium, potassium, and iron, making it one of nature's most complete nutritional supplements.",
    price: 399,
    originalPrice: 499,
    images: [
      {
        url: "/assets/product_images/moringa.png",
        alt: "Moringa Leaf Powder",
        isPrimary: true
      }
    ],
    category: "supplement",
    tags: ["superfood", "organic", "protein", "vitamins"],
    benefits: [
      "Complete protein with all 9 essential amino acids",
      "Rich in vitamins A, C, E, and minerals",
      "Supports immune system and energy levels",
      "Natural detoxification properties"
    ],
    ingredients: ["100% Pure Moringa Oleifera Leaf Powder", "No additives or preservatives"],
    nutritionFacts: {
      servingSize: "1 tablespoon (10g)",
      calories: 25,
      protein: 2.5,
      carbs: 3.8,
      fat: 0.4,
      fiber: 2.0
    },
    inventory: {
      stock: 75,
      lowStockThreshold: 15,
      isAvailable: true
    },
    weight: { value: 200, unit: "g" },
    isFeatured: true,
    sortOrder: 2
  },
  {
    name: "NutriBox Complete",
    slug: "nutribox",
    description: "Comprehensive nutrition box containing essential supplements for daily wellness and vitality",
    fullDescription: "The NutriBox Complete is a thoughtfully curated collection of premium supplements designed specifically for women's nutritional needs. Each box contains a month's supply of carefully selected vitamins, minerals, and adaptogens to support your overall health and wellness journey.",
    price: 899,
    originalPrice: 1199,
    images: [
      {
        url: "/assets/product_images/nutribox mockup.png",
        alt: "NutriBox Complete",
        isPrimary: true
      }
    ],
    category: "supplement",
    tags: ["women-health", "multivitamin", "monthly-pack", "complete-nutrition"],
    benefits: [
      "Complete monthly nutrition package",
      "Scientifically formulated for women's health",
      "Convenient daily supplement packs",
      "Third-party tested for purity and potency"
    ],
    ingredients: ["Multivitamin Complex", "Omega-3", "Probiotics", "Vitamin D3", "Magnesium", "Adaptogens"],
    inventory: {
      stock: 50,
      lowStockThreshold: 5,
      isAvailable: true
    },
    weight: { value: 500, unit: "g" },
    isFeatured: true,
    sortOrder: 3
  },
  {
    name: "Golden Turmeric Powder",
    slug: "turmeric",
    description: "Premium organic turmeric powder with high curcumin content for anti-inflammatory support",
    fullDescription: "Our Golden Turmeric Powder is sourced from the finest organic turmeric roots, carefully processed to maintain maximum curcumin content. This golden spice has been used for thousands of years in traditional medicine and is renowned for its powerful anti-inflammatory and antioxidant properties.",
    price: 199,
    originalPrice: 249,
    images: [
      {
        url: "/assets/product_images/turmeric .png",
        alt: "Golden Turmeric Powder",
        isPrimary: true
      }
    ],
    category: "powder",
    tags: ["turmeric", "curcumin", "anti-inflammatory", "organic"],
    benefits: [
      "High curcumin content for maximum potency",
      "Powerful anti-inflammatory properties",
      "Supports joint health and mobility",
      "100% organic and pure"
    ],
    ingredients: ["100% Organic Turmeric Root Powder (Curcuma Longa)"],
    nutritionFacts: {
      servingSize: "1 teaspoon (5g)",
      calories: 16,
      protein: 0.5,
      carbs: 3.2,
      fat: 0.3,
      fiber: 1.0
    },
    inventory: {
      stock: 120,
      lowStockThreshold: 20,
      isAvailable: true
    },
    weight: { value: 150, unit: "g" },
    isFeatured: true,
    sortOrder: 4
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products successfully`);

    products.forEach(product => {
      console.log(`- ${product.name} (${product.slug}) - ₹${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (process.argv[2] === '--seed') {
  seedProducts();
}

export { sampleProducts, seedProducts };