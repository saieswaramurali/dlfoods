import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Check, Share2 } from 'lucide-react';

// Import product images
import mixedMasalaImage from '../assets/product_images/mixed masala mockup.png';
import moringaImage from '../assets/product_images/moringa.png';
import nutriboxImage from '../assets/product_images/nutribox mockup.png';
import turmericImage from '../assets/product_images/turmeric .png';

interface Product {
  id: number;
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

const products: Product[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-amber-600 hover:text-amber-700">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Product URL copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Product Image */}
            <div className={`bg-gradient-to-br ${product.bgColor} rounded-2xl p-8 flex items-center justify-center border-2 ${product.borderColor} overflow-hidden`}>
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain max-h-96 hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Share product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-gray-600 ml-2">(4.8/5 - 127 reviews)</span>
                </div>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {product.fullDescription || product.description}
                </p>
              </div>

              {/* Price and Purchase */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-bold text-gray-900">{product.price}</span>
                  <span className="text-sm text-gray-500">Free shipping on orders over ₹500</span>
                </div>

                <div className="space-y-4">
                  <button className="w-full flex items-center justify-center space-x-2 bg-amber-600 text-white px-6 py-4 rounded-lg hover:bg-amber-700 transition-colors shadow-lg text-lg font-semibold">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  <button className="w-full bg-white text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors border-2 border-amber-600 font-semibold">
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Benefits */}
              {product.benefits && (
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ingredients */}
              {product.ingredients && (
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Main Ingredients</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200 font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">You might also like</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {products
              .filter(p => p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.slug}`}
                  className={`bg-gradient-to-br ${relatedProduct.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 ${relatedProduct.borderColor} overflow-hidden`}
                >
                  <div className="p-6 space-y-4">
                    <div className="w-full h-48 bg-white rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{relatedProduct.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedProduct.description}</p>
                    <span className="text-2xl font-bold text-gray-900">{relatedProduct.price}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}