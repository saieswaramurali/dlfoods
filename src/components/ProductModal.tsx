import { X, ShoppingCart, Star, Check } from 'lucide-react';

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

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className={`bg-gradient-to-br ${product.bgColor} rounded-2xl p-8 flex items-center justify-center border-2 ${product.borderColor} overflow-hidden`}>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-contain max-h-80 hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-600 ml-2">(4.8/5 - 127 reviews)</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.fullDescription || product.description}
            </p>

            {product.benefits && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.ingredients && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Main Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                <span className="text-sm text-gray-500">Free shipping on orders over ₹500</span>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-amber-600 text-white px-6 py-4 rounded-lg hover:bg-amber-700 transition-colors shadow-lg text-lg font-semibold">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button className="w-full bg-white text-amber-600 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors border-2 border-amber-600">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
