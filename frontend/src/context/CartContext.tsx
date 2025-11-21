import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

interface CartItem {
  _id?: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    slug: string;
    primaryImage: string;
  };
  quantity: number;
  addedAt?: string;
}

interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

interface CartContextType {
  cart: Cart;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>({ 
    items: [], 
    totalItems: 0, 
    subtotal: 0 
  });
  const [loading, setLoading] = useState(false);

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setCart({ items: [], totalItems: 0, subtotal: 0 });
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.cart.get();
      const data = await response.json();
      
      if (response.ok && data.success) {
        setCart(data.data.cart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to add items to cart');
    }

    try {
      setLoading(true);
      const response = await api.cart.addItem(productId, quantity);
      const data = await response.json();
      
      if (response.ok && data.success) {
        await refreshCart(); // Refresh to get updated cart
      } else {
        throw new Error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      setLoading(true);
      const response = await api.cart.updateItem(productId, quantity);
      const data = await response.json();
      
      if (response.ok && data.success) {
        await refreshCart(); // Refresh to get updated cart
      } else {
        throw new Error(data.message || 'Failed to update item quantity');
      }
    } catch (error) {
      console.error('Update quantity failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await api.cart.removeItem(productId);
      const data = await response.json();
      
      if (response.ok && data.success) {
        await refreshCart(); // Refresh to get updated cart
      } else {
        throw new Error(data.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Remove item failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await api.cart.clear();
      const data = await response.json();
      
      if (response.ok && data.success) {
        setCart({ items: [], totalItems: 0, subtotal: 0 });
      } else {
        throw new Error(data.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Clear cart failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};