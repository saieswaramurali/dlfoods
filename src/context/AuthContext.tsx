import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  authProvider: 'google' | 'email';
  joinedDate: string;
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
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
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
  login: (email: string, password?: string, provider?: 'google' | 'email') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users for testing
const DUMMY_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    authProvider: 'email' as const,
    joinedDate: '2024-01-15',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@gmail.com',
    phone: '+91 9876543211',
    authProvider: 'google' as const,
    joinedDate: '2024-02-20',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  }
];

// Dummy orders for testing
const DUMMY_ORDERS: Record<string, Order[]> = {
  '1': [
    {
      id: 'ORD001',
      date: '2024-10-20',
      items: [
        {
          id: '1',
          name: 'Margherita Pizza',
          price: '₹299',
          quantity: 2,
          image: '/src/assets/product_images/pizza1.jpg'
        },
        {
          id: '2',
          name: 'Chicken Burger',
          price: '₹199',
          quantity: 1,
          image: '/src/assets/product_images/burger1.jpg'
        }
      ],
      total: 797,
      status: 'delivered',
      shippingAddress: {
        fullName: 'John Doe',
        address: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 9876543210'
      },
      paymentMethod: 'UPI',
      trackingId: 'TRK123456789'
    },
    {
      id: 'ORD002',
      date: '2024-10-25',
      items: [
        {
          id: '3',
          name: 'Chicken Biryani',
          price: '₹249',
          quantity: 1,
          image: '/src/assets/product_images/biryani1.jpg'
        }
      ],
      total: 299,
      status: 'out-for-delivery',
      shippingAddress: {
        fullName: 'John Doe',
        address: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+91 9876543210'
      },
      paymentMethod: 'Card',
      trackingId: 'TRK987654321'
    }
  ],
  '2': [
    {
      id: 'ORD003',
      date: '2024-10-22',
      items: [
        {
          id: '4',
          name: 'Chocolate Cake',
          price: '₹399',
          quantity: 1,
          image: '/src/assets/product_images/cake1.jpg'
        }
      ],
      total: 449,
      status: 'delivered',
      shippingAddress: {
        fullName: 'Jane Smith',
        address: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '+91 9876543211'
      },
      paymentMethod: 'UPI',
      trackingId: 'TRK555666777'
    }
  ]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('dlfoods_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setOrders(DUMMY_ORDERS[userData.id] || []);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string, provider: 'google' | 'email' = 'email'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let foundUser: User | null = null;
    
    if (provider === 'google') {
      // Simulate Google OAuth - find or create user
      foundUser = DUMMY_USERS.find(u => u.email === email && u.authProvider === 'google') || null;
      
      if (!foundUser && email) {
        // Create new Google user
        foundUser = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          authProvider: 'google',
          joinedDate: new Date().toISOString().split('T')[0],
          profileImage: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=f59e0b&color=ffffff`
        };
      }
    } else {
      // Email login - simple validation
      foundUser = DUMMY_USERS.find(u => u.email === email) || null;
      
      // For demo, accept any email with password "123456"
      if (!foundUser && password === '123456') {
        foundUser = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email,
          authProvider: 'email',
          joinedDate: new Date().toISOString().split('T')[0]
        };
      }
    }
    
    if (foundUser) {
      setUser(foundUser);
      setOrders(DUMMY_ORDERS[foundUser.id] || []);
      localStorage.setItem('dlfoods_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('dlfoods_user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('dlfoods_user', JSON.stringify(updatedUser));
    }
  };

  const addOrder = (order: Order) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    
    // Update dummy data for persistence (in real app, this would be API call)
    if (user) {
      DUMMY_ORDERS[user.id] = newOrders;
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    
    // Update dummy data for persistence
    if (user) {
      DUMMY_ORDERS[user.id] = updatedOrders;
    }
  };

  const value: AuthContextType = {
    user,
    orders,
    isLoading,
    login,
    logout,
    updateProfile,
    addOrder,
    updateOrderStatus
  };

  return (
    <AuthContext.Provider value={value}>
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