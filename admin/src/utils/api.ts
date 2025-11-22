// API Configuration for Admin Dashboard
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  ADMIN_SECRET: import.meta.env.VITE_ADMIN_SECRET_KEY || '',
  ENDPOINTS: {
    // Admin Dashboard
    ADMIN: {
      DASHBOARD_STATS: '/api/admin/dashboard/stats',
      ORDERS: '/api/admin/orders',
      UPDATE_ORDER_STATUS: (orderId: string) => `/api/admin/orders/${orderId}/status`,
      CONTACTS: '/api/admin/contacts',
      UPDATE_CONTACT_STATUS: (contactId: string) => `/api/admin/contacts/${contactId}/status`,
      USERS: '/api/admin/users'
    }
  }
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for API requests with admin secret key authentication
export const adminApiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Use admin secret from environment variables
  const actualSecret = API_CONFIG.ADMIN_SECRET;
  
  if (!actualSecret) {
    throw new Error('Admin secret key not configured. Please check VITE_ADMIN_SECRET_KEY environment variable.');
  }
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Secret': actualSecret,
      ...options.headers,
    },
  };

  const response = await fetch(buildApiUrl(endpoint), {
    ...defaultOptions,
    ...options,
  });

  // Handle authentication errors
  if (response.status === 401 || response.status === 403) {
    console.error('Admin authentication failed');
    throw new Error('Admin authentication failed');
  }

  return response;
};

// Specific API methods for Admin Dashboard
export const adminApi = {
  // Dashboard Stats
  dashboard: {
    getStats: () => adminApiRequest(API_CONFIG.ENDPOINTS.ADMIN.DASHBOARD_STATS)
  },

  // Orders Management
  orders: {
    getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.status) searchParams.set('status', params.status);
      if (params?.search) searchParams.set('search', params.search);
      
      const query = searchParams.toString();
      return adminApiRequest(`${API_CONFIG.ENDPOINTS.ADMIN.ORDERS}${query ? `?${query}` : ''}`);
    },
    
    updateStatus: (orderId: string, status: string) => 
      adminApiRequest(API_CONFIG.ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(orderId), {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
  },

  // Contact Management
  contacts: {
    getAll: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.status) searchParams.set('status', params.status);
      if (params?.search) searchParams.set('search', params.search);
      
      const query = searchParams.toString();
      return adminApiRequest(`${API_CONFIG.ENDPOINTS.ADMIN.CONTACTS}${query ? `?${query}` : ''}`);
    },
    
    updateStatus: (contactId: string, status: string) => 
      adminApiRequest(API_CONFIG.ENDPOINTS.ADMIN.UPDATE_CONTACT_STATUS(contactId), {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
  },

  // Users Management
  users: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      
      const query = searchParams.toString();
      return adminApiRequest(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}${query ? `?${query}` : ''}`);
    }
  }
};

export default API_CONFIG;