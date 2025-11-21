import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../utils/auth';
import api from '../utils/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  authProvider: 'google';
  joinedDate: string;
  addresses?: Array<{
    id: string;
    isDefault: boolean;
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }>;
}

export interface Order {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
  trackingId?: string;
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void; // Google OAuth only
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  refreshUser: () => Promise<void>;
  loadUserOrders: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    
    try {
      const { token, user: storedUser } = AuthService.getStoredAuthData();
      
      if (token && storedUser) {
        // Verify token with backend
        const { valid, user: verifiedUser } = await AuthService.verifyToken(token);
        
        if (valid && verifiedUser) {
          setUser(verifiedUser);
          setIsAuthenticated(true);
        } else {
          // Token invalid, clear auth data
          AuthService.clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      AuthService.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthCallback = async () => {
    // Check if this is an OAuth callback page
    if (window.location.pathname === '/auth/success' || window.location.search.includes('token=')) {
      try {
        const result = await AuthService.handleOAuthCallback();
        
        if (result.success) {
          // Refresh auth state after successful OAuth
          await initializeAuth();
          
          // Redirect to home page
          window.location.href = '/';
        } else {
          console.error('OAuth callback failed:', result.error);
          // You could show an error toast here
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
      }
    }
  };

  const loadUserOrders = async () => {
    if (!AuthService.isAuthenticated()) return;
    
    try {
      const response = await api.orders.getAll();
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Transform backend order format to frontend format
        const transformedOrders = data.data.orders.map((order: any) => ({
          id: order.orderId,
          date: new Date(order.createdAt).toLocaleDateString(),
          items: order.items.map((item: any) => ({
            id: item.productId._id || item.productId,
            name: item.name,
            price: `₹${item.price}`,
            quantity: item.quantity,
            image: item.image
          })),
          total: order.pricing.total,
          status: order.status,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentDetails.method,
          trackingId: order.tracking.trackingId
        }));
        
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const login = () => {
    // Initiate Google OAuth flow
    AuthService.initiateGoogleAuth();
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await AuthService.logout();
      setUser(null);
      setOrders([]);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;
    
    try {
      const response = await api.users.updateProfile(updates);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.data.user);
        // Update stored user data
        const { token } = AuthService.getStoredAuthData();
        if (token) {
          AuthService.setAuthData(token, data.data.user);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    try {
      const updatedUser = await AuthService.refreshUserData();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      orders,
      isLoading,
      isAuthenticated,
      login,
      logout,
      updateProfile,
      addOrder,
      updateOrderStatus,
      refreshUser,
      loadUserOrders
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}