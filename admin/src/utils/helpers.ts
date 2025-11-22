// Utility functions for admin dashboard

// Date formatting
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Currency formatting
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Order status color mapping
export const getOrderStatusColor = (status: string) => {
  const colors = {
    pending: 'admin-badge-yellow',
    confirmed: 'admin-badge-blue',
    processing: 'admin-badge-blue',
    shipped: 'admin-badge-yellow',
    delivered: 'admin-badge-green',
    cancelled: 'admin-badge-red',
    refunded: 'admin-badge-gray'
  };
  return colors[status as keyof typeof colors] || 'admin-badge-gray';
};

// Contact status color mapping
export const getContactStatusColor = (status: string) => {
  const colors = {
    new: 'admin-badge-red',
    in_progress: 'admin-badge-yellow',
    resolved: 'admin-badge-green',
    closed: 'admin-badge-gray'
  };
  return colors[status as keyof typeof colors] || 'admin-badge-gray';
};

// Priority color mapping
export const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'admin-badge-gray',
    medium: 'admin-badge-yellow',
    high: 'admin-badge-red'
  };
  return colors[priority as keyof typeof colors] || 'admin-badge-gray';
};

// Truncate text
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate reference number
export const generateReferenceNumber = (id: string, prefix: string = 'DLF') => {
  return `${prefix}-${id.slice(-8).toUpperCase()}`;
};

// Parse URL search params
export const parseSearchParams = (search: string) => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};

// Build search params
export const buildSearchParams = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams;
};