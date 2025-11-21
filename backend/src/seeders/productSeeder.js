import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

const products = [
  {
    _id: new mongoose.Types.ObjectId('674551234567890123456789'), // Fixed ObjectId for mixed-masala
    name: "Mixed Masala Blend",
    description: "Premium spice blend combining traditional Indian masalas for authentic flavor and health benefits",
    fullDescription: "Our Mixed Masala Blend is a carefully crafted combination of traditional Indian spices that not only enhance the flavor of your dishes but also provide numerous health benefits. Each spice is sourced from organic farms and ground fresh to preserve maximum potency and flavor.",
    price: 249,
    originalPrice: 299,
    category: "masala",
    slug: "mixed-masala",
    tags: ["organic", "traditional", "spice-blend", "healthy"],
    benefits: [
      "Rich in antioxidants and anti-inflammatory compounds",
      "Supports digestive health and metabolism",
      "100% organic and natural ingredients",
      "Authentic traditional recipe"
    ],
    ingredients: ["Cumin", "Coriander", "Turmeric", "Red Chili", "Garam Masala", "Fenugreek", "Mustard Seeds"],
    nutritionalInfo: {
      servingSize: "1 teaspoon (5g)",
      calories: 15,
      values: [
        { nutrient: "Protein", amount: "0.5g" },
        { nutrient: "Carbohydrates", amount: "2g" },
        { nutrient: "Fat", amount: "0.5g" },
        { nutrient: "Fiber", amount: "1g" }
      ]
    },
    images: [
      {
        url: "/assets/product_images/mixed-masala.jpg",
        isPrimary: true,
        altText: "Mixed Masala Blend"
      }
    ],
    inventory: {
      stock: 500,
      lowStockThreshold: 50,
      isAvailable: true
    },
    seo: {
      metaTitle: "Mixed Masala Blend - Premium Organic Spice | DL Foods",
      metaDescription: "Premium organic mixed masala blend with authentic traditional recipe. Rich in antioxidants and supports digestive health.",
      keywords: ["mixed masala", "organic spices", "traditional", "healthy cooking"]
    },
    isActive: true,
    isFeatured: true
  },
  {
    _id: new mongoose.Types.ObjectId('674551234567890123456790'), // Fixed ObjectId for moringa
    name: "Moringa Leaf Powder",
    description: "Nutrient-dense superfood powder from organic moringa leaves, packed with vitamins and minerals",
    fullDescription: "Known as the 'Tree of Life', our premium Moringa Leaf Powder is sourced from organically grown moringa trees. This superfood contains all essential amino acids, vitamins A, C, and E, calcium, potassium, and iron, making it one of nature's most complete nutritional supplements.",
    price: 399,
    originalPrice: 499,
    category: "supplement",
    slug: "moringa",
    tags: ["superfood", "organic", "protein", "vitamins", "minerals"],
    benefits: [
      "Complete protein with all 9 essential amino acids",
      "Rich in vitamins A, C, E, and minerals",
      "Supports immune system and energy levels",
      "Natural detoxification properties"
    ],
    ingredients: ["100% Pure Moringa Oleifera Leaf Powder", "No additives or preservatives"],
    nutritionalInfo: {
      servingSize: "1 tablespoon (10g)",
      calories: 25,
      values: [
        { nutrient: "Protein", amount: "2.5g" },
        { nutrient: "Vitamin A", amount: "378 mcg" },
        { nutrient: "Vitamin C", amount: "51mg" },
        { nutrient: "Calcium", amount: "185mg" },
        { nutrient: "Iron", amount: "4mg" }
      ]
    },
    images: [
      {
        url: "/assets/product_images/moringa.jpg",
        isPrimary: true,
        altText: "Moringa Leaf Powder"
      }
    ],
    inventory: {
      stock: 300,
      lowStockThreshold: 30,
      isAvailable: true
    },
    seo: {
      metaTitle: "Moringa Leaf Powder - Organic Superfood | DL Foods",
      metaDescription: "Premium organic moringa leaf powder packed with complete proteins, vitamins, and minerals. Natural superfood for energy and immunity.",
      keywords: ["moringa powder", "superfood", "organic supplement", "protein", "vitamins"]
    },
    isActive: true,
    isFeatured: true
  },
  {
    _id: new mongoose.Types.ObjectId('674551234567890123456791'), // Fixed ObjectId for nutribox
    name: "NutriBox Complete",
    description: "Comprehensive nutrition box containing essential supplements for daily wellness and vitality",
    fullDescription: "The NutriBox Complete is a thoughtfully curated collection of premium supplements designed specifically for women's nutritional needs. Each box contains a month's supply of carefully selected vitamins, minerals, and adaptogens to support your overall health and wellness journey.",
    price: 899,
    originalPrice: 1199,
    category: "supplement",
    slug: "nutribox",
    tags: ["complete-nutrition", "women-health", "monthly-pack", "premium"],
    benefits: [
      "Complete monthly nutrition package",
      "Scientifically formulated for women's health",
      "Convenient daily supplement packs",
      "Third-party tested for purity and potency"
    ],
    ingredients: ["Multivitamin Complex", "Omega-3", "Probiotics", "Vitamin D3", "Magnesium", "Adaptogens"],
    nutritionalInfo: {
      servingSize: "1 daily pack",
      calories: 10,
      values: [
        { nutrient: "Vitamin D3", amount: "1000 IU" },
        { nutrient: "Omega-3 EPA/DHA", amount: "500mg" },
        { nutrient: "Probiotics", amount: "10 billion CFU" },
        { nutrient: "Magnesium", amount: "200mg" }
      ]
    },
    images: [
      {
        url: "/assets/product_images/nutribox.jpg",
        isPrimary: true,
        altText: "NutriBox Complete"
      }
    ],
    inventory: {
      stock: 150,
      lowStockThreshold: 20,
      isAvailable: true
    },
    seo: {
      metaTitle: "NutriBox Complete - Women's Health Pack | DL Foods",
      metaDescription: "Complete monthly nutrition package designed for women's health. Premium supplements with vitamins, minerals, and adaptogens.",
      keywords: ["nutribox", "women's health", "monthly supplements", "complete nutrition", "vitamins"]
    },
    isActive: true,
    isFeatured: true
  },
  {
    _id: new mongoose.Types.ObjectId('674551234567890123456792'), // Fixed ObjectId for turmeric
    name: "Golden Turmeric Powder",
    description: "Premium organic turmeric powder with high curcumin content for anti-inflammatory support",
    fullDescription: "Our Golden Turmeric Powder is sourced from the finest organic turmeric roots, carefully processed to maintain maximum curcumin content. This golden spice has been used for thousands of years in traditional medicine and is renowned for its powerful anti-inflammatory and antioxidant properties.",
    price: 199,
    originalPrice: 249,
    category: "powder",
    slug: "turmeric",
    tags: ["organic", "anti-inflammatory", "curcumin", "traditional"],
    benefits: [
      "High bioavailability curcumin content",
      "Powerful anti-inflammatory properties",
      "Supports joint health and mobility",
      "Natural immune system booster"
    ],
    ingredients: ["100% Organic Turmeric Root Powder", "Standardized to 95% Curcuminoids", "Black Pepper Extract (for enhanced absorption)"],
    nutritionalInfo: {
      servingSize: "1 teaspoon (3g)",
      calories: 9,
      values: [
        { nutrient: "Curcumin", amount: "150mg" },
        { nutrient: "Protein", amount: "0.3g" },
        { nutrient: "Carbohydrates", amount: "2g" },
        { nutrient: "Iron", amount: "1.4mg" }
      ]
    },
    images: [
      {
        url: "/assets/product_images/turmeric.jpg",
        isPrimary: true,
        altText: "Golden Turmeric Powder"
      }
    ],
    inventory: {
      stock: 400,
      lowStockThreshold: 40,
      isAvailable: true
    },
    seo: {
      metaTitle: "Golden Turmeric Powder - High Curcumin | DL Foods",
      metaDescription: "Premium organic turmeric powder with high curcumin content. Powerful anti-inflammatory support for joint health and immunity.",
      keywords: ["turmeric powder", "curcumin", "organic", "anti-inflammatory", "joint health"]
    },
    isActive: true,
    isFeatured: true
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Successfully seeded 4 products:');
    products.forEach(product => {
      console.log(`   - ${product.name} (ID: ${product._id})`);
    });

    console.log('\n🎉 Product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run the seeder
seedProducts();