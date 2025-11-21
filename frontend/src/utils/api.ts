// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  ENDPOINTS: {
    // Authentication
    AUTH: {
      GOOGLE: '/api/auth/google',
      CALLBACK: '/api/auth/google/callback', 
      VERIFY: '/api/auth/verify',
      LOGOUT: '/api/auth/logout',
      ME: '/api/auth/me'
    },
    // Users
    USERS: {
      PROFILE: '/api/users/profile',
      ADDRESSES: '/api/users/addresses',
      ORDERS: '/api/users/orders'
    },
    // Products
    PRODUCTS: {
      LIST: '/api/products',
      FEATURED: '/api/products/featured',
      CATEGORIES: '/api/products/categories',
      SEARCH: '/api/products/search',
      DETAIL: (slug: string) => `/api/products/${slug}`,
      REVIEWS: (id: string) => `/api/products/${id}/reviews`
    },
    // Orders
    ORDERS: {
      LIST: '/api/orders',
      CREATE: '/api/orders',
      DETAIL: (orderId: string) => `/api/orders/${orderId}`,
      CANCEL: (orderId: string) => `/api/orders/${orderId}/cancel`,
      TRACK: (orderId: string) => `/api/orders/${orderId}/track`
    },
    // Cart
    CART: {
      GET: '/api/cart',
      ADD_ITEM: '/api/cart/items',
      UPDATE_ITEM: (productId: string) => `/api/cart/items/${productId}`,
      REMOVE_ITEM: (productId: string) => `/api/cart/items/${productId}`,
      CLEAR: '/api/cart'
    }
  }
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for API requests with common headers
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('dlfoods_auth_token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(buildApiUrl(endpoint), {
    ...defaultOptions,
    ...options,
  });

  // Handle token expiration
  if (response.status === 401) {
    localStorage.removeItem('dlfoods_auth_token');
    localStorage.removeItem('dlfoods_user_data');
    window.location.href = '/';
  }

  return response;
};

// Specific API methods
export const api = {
  // Authentication
  auth: {
    verify: (token: string) => 
      apiRequest(API_CONFIG.ENDPOINTS.AUTH.VERIFY, {
        method: 'POST',
        body: JSON.stringify({ token })
      }),
    
    getMe: () => apiRequest(API_CONFIG.ENDPOINTS.AUTH.ME),
    
    logout: () => 
      apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { method: 'POST' })
  },

  // Users
  users: {
    getProfile: () => apiRequest(API_CONFIG.ENDPOINTS.USERS.PROFILE),
    
    updateProfile: (data: any) => 
      apiRequest(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    
    getAddresses: () => apiRequest(API_CONFIG.ENDPOINTS.USERS.ADDRESSES),
    
    addAddress: (address: any) => 
      apiRequest(API_CONFIG.ENDPOINTS.USERS.ADDRESSES, {
        method: 'POST',
        body: JSON.stringify(address)
      }),
    
    updateAddress: (addressId: string, address: any) => 
      apiRequest(`${API_CONFIG.ENDPOINTS.USERS.ADDRESSES}/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(address)
      }),
    
    deleteAddress: (addressId: string) => 
      apiRequest(`${API_CONFIG.ENDPOINTS.USERS.ADDRESSES}/${addressId}`, {
        method: 'DELETE'
      }),

    getOrders: (params?: URLSearchParams) => 
      apiRequest(`${API_CONFIG.ENDPOINTS.USERS.ORDERS}${params ? `?${params}` : ''}`)
  },

  // Products
  products: {
    getAll: (params?: URLSearchParams) => 
      apiRequest(`${API_CONFIG.ENDPOINTS.PRODUCTS.LIST}${params ? `?${params}` : ''}`),
    
    getFeatured: () => apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS.FEATURED),
    
    getCategories: () => apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS.CATEGORIES),
    
    search: (query: string, limit?: number) => 
      apiRequest(`${API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(query)}${limit ? `&limit=${limit}` : ''}`),
    
    getBySlug: (slug: string) => 
      apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL(slug)),
    
    getReviews: (productId: string, params?: URLSearchParams) => 
      apiRequest(`${API_CONFIG.ENDPOINTS.PRODUCTS.REVIEWS(productId)}${params ? `?${params}` : ''}`)
  },

  // Orders
  orders: {
    getAll: (params?: URLSearchParams) => 
      apiRequest(`${API_CONFIG.ENDPOINTS.ORDERS.LIST}${params ? `?${params}` : ''}`),
    
    create: (orderData: any) => 
      apiRequest(API_CONFIG.ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        body: JSON.stringify(orderData)
      }),
    
    getById: (orderId: string) => 
      apiRequest(API_CONFIG.ENDPOINTS.ORDERS.DETAIL(orderId)),
    
    cancel: (orderId: string, reason?: string) => 
      apiRequest(API_CONFIG.ENDPOINTS.ORDERS.CANCEL(orderId), {
        method: 'PUT',
        body: JSON.stringify({ reason })
      }),
    
    track: (orderId: string) => 
      apiRequest(API_CONFIG.ENDPOINTS.ORDERS.TRACK(orderId))
  },

  // Cart
  cart: {
    get: () => apiRequest(API_CONFIG.ENDPOINTS.CART.GET),
    
    addItem: (productId: string, quantity: number) => 
      apiRequest(API_CONFIG.ENDPOINTS.CART.ADD_ITEM, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
      }),
    
    updateItem: (productId: string, quantity: number) => 
      apiRequest(API_CONFIG.ENDPOINTS.CART.UPDATE_ITEM(productId), {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      }),
    
    removeItem: (productId: string) => 
      apiRequest(API_CONFIG.ENDPOINTS.CART.REMOVE_ITEM(productId), {
        method: 'DELETE'
      }),
    
    clear: () => 
      apiRequest(API_CONFIG.ENDPOINTS.CART.CLEAR, { method: 'DELETE' })
  }
};

export { API_CONFIG };
export default api;