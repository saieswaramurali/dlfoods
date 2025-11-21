import { useEffect } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToastContext } from '../context/ToastContext';
import { useLoginModal } from '../App';

// Import product images
import mixedMasalaImage from '../assets/product_images/mixed masala mockup.png';
import moringaImage from '../assets/product_images/moringa.png';
import nutriboxImage from '../assets/product_images/nutribox mockup.png';
import turmericImage from '../assets/product_images/turmeric .png';

interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: string;
  image: string;
  bgColor: string;
  borderColor: string;
  benefits?: string[];
  ingredients?: string[];
  slug: string;
}

export default function Products() {
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToastContext();
  const { openLoginModal } = useLoginModal();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const products: Product[] = [
    {
      id: "674551234567890123456789", // Real MongoDB ObjectId
      name: "Mixed Masala Blend",
      description: "Premium spice blend combining traditional Indian masalas for authentic flavor and health benefits",
      fullDescription: "Our Mixed Masala Blend is a carefully crafted combination of traditional Indian spices that not only enhance the flavor of your dishes but also provide numerous health benefits. Each spice is sourced from organic farms and ground fresh to preserve maximum potency and flavor.",
      price: "₹249",
      image: mixedMasalaImage,
      bgColor: "from-red-100 to-orange-50",
      borderColor: "border-red-200",
      slug: "mixed-masala",
      benefits: [
        "Rich in antioxidants and anti-inflammatory compounds",
        "Supports digestive health and metabolism",
        "100% organic and natural ingredients",
        "Authentic traditional recipe"
      ],
      ingredients: ["Cumin", "Coriander", "Turmeric", "Red Chili", "Garam Masala", "Fenugreek", "Mustard Seeds"]
    },
    {
      id: "674551234567890123456790", // Real MongoDB ObjectId
      name: "Moringa Leaf Powder",
      description: "Nutrient-dense superfood powder from organic moringa leaves, packed with vitamins and minerals",
      fullDescription: "Known as the 'Tree of Life', our premium Moringa Leaf Powder is sourced from organically grown moringa trees. This superfood contains all essential amino acids, vitamins A, C, and E, calcium, potassium, and iron, making it one of nature's most complete nutritional supplements.",
      price: "₹399",
      image: moringaImage,
      bgColor: "from-green-100 to-emerald-50",
      borderColor: "border-green-200",
      slug: "moringa",
      benefits: [
        "Complete protein with all 9 essential amino acids",
        "Rich in vitamins A, C, E, and minerals",
        "Supports immune system and energy levels",
        "Natural detoxification properties"
      ],
      ingredients: ["100% Pure Moringa Oleifera Leaf Powder", "No additives or preservatives"]
    },
    {
      id: "674551234567890123456791", // Real MongoDB ObjectId
      name: "NutriBox Complete",
      description: "Comprehensive nutrition box containing essential supplements for daily wellness and vitality",
      fullDescription: "The NutriBox Complete is a thoughtfully curated collection of premium supplements designed specifically for women's nutritional needs. Each box contains a month's supply of carefully selected vitamins, minerals, and adaptogens to support your overall health and wellness journey.",
      price: "₹899",
      image: nutriboxImage,
      bgColor: "from-purple-100 to-pink-50",
      borderColor: "border-purple-200",
      slug: "nutribox",
      benefits: [
        "Complete monthly nutrition package",
        "Scientifically formulated for women's health",
        "Convenient daily supplement packs",
        "Third-party tested for purity and potency"
      ],
      ingredients: ["Multivitamin Complex", "Omega-3", "Probiotics", "Vitamin D3", "Magnesium", "Adaptogens"]
    },
    {
      id: "674551234567890123456792", // Real MongoDB ObjectId
      name: "Golden Turmeric Powder",
      description: "Premium organic turmeric powder with high curcumin content for anti-inflammatory support",
      fullDescription: "Our Golden Turmeric Powder is sourced from the finest organic turmeric roots, carefully processed to maintain maximum curcumin content. This golden spice has been used for thousands of years in traditional medicine and is renowned for its powerful anti-inflammatory and antioxidant properties.",
      price: "₹199",
      image: turmericImage,
      bgColor: "from-yellow-100 to-amber-50",
      borderColor: "border-yellow-200",
      slug: "turmeric",
      benefits: [
        "High bioavailability curcumin content",
        "Powerful anti-inflammatory properties",
        "Supports joint health and mobility",
        "Natural immune system booster"
      ],
      ingredients: ["100% Organic Turmeric Root Powder", "Standardized to 95% Curcuminoids", "Black Pepper Extract (for enhanced absorption)"]
    }
  ];

  return (
    <section id="products" className="pt-28 pb-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium nutrition crafted specifically for women 25+. Each product is designed to support your unique wellness needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.slug}`}
              className={`bg-gradient-to-br ${product.bgColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 ${product.borderColor} overflow-hidden cursor-pointer`}
            >
              <div className="p-6 space-y-4">
                <div className="w-full h-48 bg-white rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

                                  <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                          await addToCart(product.id, 1);
                          showSuccess(`${product.name} added to cart! 🛒`);
                        } catch (error) {
                          const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
                          showError(errorMessage);
                          // If login is required, also open the login modal
                          if (errorMessage.includes('sign in') || errorMessage.includes('log in')) {
                            openLoginModal();
                          }
                        }
                      }}
                      className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
