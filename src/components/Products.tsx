import { ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import ProductModal from './ProductModal';

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
}

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: "Product Name 1",
      description: "Product description will go here - tailored nutrition for women's wellness and vitality",
      fullDescription: "This premium supplement is specially formulated for women 25+ to support daily wellness, energy levels, and overall vitality. Made with natural ingredients and backed by science.",
      price: "$29.99",
      image: "product1",
      bgColor: "from-amber-100 to-amber-50",
      borderColor: "border-amber-200",
      benefits: [
        "Supports daily energy and vitality",
        "Formulated specifically for women 25+",
        "100% natural ingredients",
        "Clinically tested and proven"
      ],
      ingredients: ["Vitamin D", "Calcium", "Iron", "B-Complex", "Omega-3"]
    },
    {
      id: 2,
      name: "Product Name 2",
      description: "Product description will go here - enhanced formula for optimal health support",
      fullDescription: "An enhanced formula designed to provide comprehensive health support with a focus on women's unique nutritional needs. Perfect for active lifestyles.",
      price: "$34.99",
      image: "product2",
      bgColor: "from-orange-100 to-orange-50",
      borderColor: "border-orange-200",
      benefits: [
        "Enhanced nutritional support",
        "Boosts immune system",
        "Supports bone health",
        "Promotes healthy skin and hair"
      ],
      ingredients: ["Collagen", "Biotin", "Zinc", "Vitamin C", "Probiotics"]
    },
    {
      id: 3,
      name: "Product Name 3",
      description: "Product description will go here - natural ingredients for peak performance",
      fullDescription: "Premium natural ingredients combined to help you achieve peak performance in your daily activities while supporting long-term wellness goals.",
      price: "$39.99",
      image: "product3",
      bgColor: "from-purple-100 to-purple-50",
      borderColor: "border-purple-200",
      benefits: [
        "Enhances physical performance",
        "Supports mental clarity",
        "Reduces fatigue",
        "Improves recovery time"
      ],
      ingredients: ["Ashwagandha", "Turmeric", "Ginseng", "Green Tea", "Magnesium"]
    },
    {
      id: 4,
      name: "Product Name 4",
      description: "Product description will go here - complete nutrition for active lifestyle",
      fullDescription: "A complete nutrition solution designed for women with active lifestyles. Provides comprehensive support for energy, recovery, and overall wellness.",
      price: "$44.99",
      image: "product4",
      bgColor: "from-orange-100 to-orange-50",
      borderColor: "border-orange-200",
      benefits: [
        "Complete nutritional profile",
        "Supports active lifestyle",
        "Promotes muscle recovery",
        "Balances hormones naturally"
      ],
      ingredients: ["Protein Blend", "BCAA", "Adaptogens", "Antioxidants", "Fiber"]
    }
  ];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <>
      <section id="products" className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium nutrition crafted specifically for women 25+. Each product is designed to support your unique wellness needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`bg-gradient-to-br ${product.bgColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 ${product.borderColor} overflow-hidden cursor-pointer`}
              >
                <div className="p-6 space-y-4">
                  <div className="w-full h-48 bg-white rounded-xl flex items-center justify-center shadow-inner">
                    <div className="text-center space-y-2">
                      <div className="text-5xl">📦</div>
                      <p className="text-gray-400 text-xs">{product.image}</p>
                    </div>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product);
                      }}
                      className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
