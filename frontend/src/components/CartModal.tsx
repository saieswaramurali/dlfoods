import { X, Plus, Minus, ShoppingBag, Trash2, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import { getProductImageWithFallback } from '../utils/productImages';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToastContext();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await updateQuantity(productId, quantity);
      showSuccess('Cart updated successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId);
      showSuccess('Item removed from cart');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      showSuccess('Cart cleared successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      showError('Your cart is empty');
      return;
    }
    // TODO: Implement checkout flow
    alert(`Checkout initiated! Total: ₹${cart.subtotal}`);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-sm">
              {cart.totalItems} items
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {loading && <Loader className="w-5 h-5 animate-spin text-amber-600" />}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-96 p-6">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Please sign in</h3>
              <p className="text-gray-500">Sign in to view your cart items</p>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img 
                    src={getProductImageWithFallback(item.productId._id, item.productId.primaryImage)} 
                    alt={item.productId.name}
                    className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.productId.name}</h4>
                    <p className="text-amber-600 font-bold">₹{item.productId.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId._id, Math.max(0, item.quantity - 1))}
                      className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
                      disabled={loading}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="p-2 hover:bg-red-50 text-red-500 rounded-full disabled:opacity-50"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {isAuthenticated && cart.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-amber-600">₹{cart.subtotal}</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleClearCart}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold disabled:opacity-50"
                disabled={loading}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}