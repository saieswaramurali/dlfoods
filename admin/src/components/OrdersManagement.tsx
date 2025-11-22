import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  TrendingUp,
  DollarSign,
  Clock,
  ShoppingBag
} from 'lucide-react';
import { adminApi } from '../utils/api';
import { 
  formatDate, 
  formatCurrency, 
  getOrderStatusColor, 
  truncateText
} from '../utils/helpers';

interface Order {
  _id: string;
  orderId: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  monthlyGrowth: number;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Filters and pagination
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  
  const ordersPerPage = 10;
  
  // Order status tabs with dynamic counts
  const statusTabs = [
    { key: 'pending', label: 'New Orders', count: orderCounts.pending || 0 },
    { key: 'confirmed', label: 'Confirmed', count: orderCounts.confirmed || 0 },
    { key: 'preparing', label: 'Preparing', count: orderCounts.preparing || 0 },
    { key: 'shipped', label: 'Shipped', count: orderCounts.shipped || 0 },
    { key: 'delivered', label: 'Delivered', count: orderCounts.delivered || 0 },
    { key: 'cancelled', label: 'Cancelled', count: orderCounts.cancelled || 0 },
    { key: 'refunded', label: 'Refunded', count: orderCounts.refunded || 0 }
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, debouncedSearchTerm, activeTab]);
  
  useEffect(() => {
    fetchStats();
    fetchOrderCounts();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: ordersPerPage,
        search: debouncedSearchTerm.trim(),
        status: activeTab
      };
      
      const response = await adminApi.orders.getAll(params);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data) {
          const ordersData = data.data.orders || [];
          
          setOrders(ordersData);
        } else {
          setOrders([]);
        }
      } else {
        // API failed - show empty state
        setOrders([]);
      }
    } catch (error) {
      // Show empty state on error
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminApi.dashboard.getStats();
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.stats) {
          const apiStats = data.data.stats;
          setStats({
            totalOrders: apiStats.totalOrders || 0,
            pendingOrders: apiStats.pendingOrders || 0,
            completedOrders: apiStats.completedOrders || 0,
            totalRevenue: apiStats.totalRevenue || 0,
            todayOrders: apiStats.todayOrders || 0,
            monthlyGrowth: 15.5 // Can be calculated from API data later
          });
        } else {
          throw new Error('Invalid stats response');
        }
      } else {
        throw new Error(`Stats API failed: ${response.status}`);
      }
    } catch (error) {
      // Failed to fetch order stats - show zeros
      setStats({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        todayOrders: 0,
        monthlyGrowth: 0
      });
    }
  };

  // Fetch order counts for all statuses to update tab counts
  const fetchOrderCounts = async () => {
    try {
      const statuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded'];
      const counts: { [key: string]: number } = {};
      
      // Fetch count for each status
      for (const status of statuses) {
        const response = await adminApi.orders.getAll({ page: 1, limit: 1, status });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.pagination) {
            counts[status] = data.data.pagination.total || 0;
          }
        }
      }
      
      setOrderCounts(counts);
    } catch (error) {
      // Error fetching counts - will show 0 counts
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await adminApi.orders.updateStatus(orderId, newStatus);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Refresh orders list to show updated status
          await fetchOrders();
          
          // Also refresh stats and counts to update everything
          await fetchStats();
          await fetchOrderCounts();
        } else {
          // Failed to update order status
        }
      } else {
        // Order update API error
      }
    } catch (error) {
      // Failed to update order status
    }
  };

  // Bulk actions for status transitions
  const handleBulkStatusUpdate = async (_fromStatus: string, toStatus: string) => {
    try {
      setLoading(true);
      const orderIds = orders.map(order => order._id);
      
      // Update all orders in current view
      const promises = orderIds.map(orderId => 
        adminApi.orders.updateStatus(orderId, toStatus)
      );
      
      await Promise.all(promises);
      
      // Refresh the orders list, stats, and counts
      await fetchOrders();
      await fetchStats();
      await fetchOrderCounts();
    } catch (error) {
      // Error in bulk status update - will be handled silently
    } finally {
      setLoading(false);
    }
  };

  // Get aggregated product counts for current orders
  const getProductAggregation = () => {
    const productCounts: { [key: string]: { name: string; quantity: number; image: string } } = {};
    
    orders.forEach(order => {
      order.items?.forEach(item => {
        const key = item.productId || item.name;
        // Ensure quantity is properly calculated - item.quantity should already be the total quantity
        const itemQuantity = Number(item.quantity) || 0;
        if (productCounts[key]) {
          productCounts[key].quantity += itemQuantity;
        } else {
          productCounts[key] = {
            name: item.name,
            quantity: itemQuantity,
            image: item.image || '/api/placeholder/32/32'
          };
        }
      });
    });
    
    return Object.values(productCounts).sort((a, b) => b.quantity - a.quantity);
  };

  // Get bulk action button config based on current status
  const getBulkActionConfig = () => {
    switch (activeTab) {
      case 'pending':
        return {
          label: 'Confirm All Orders',
          action: () => handleBulkStatusUpdate('pending', 'confirmed'),
          color: 'bg-blue-600 hover:bg-blue-700',
          icon: '✓'
        };
      case 'confirmed':
        return {
          label: 'Prepare All Orders', 
          action: () => handleBulkStatusUpdate('confirmed', 'preparing'),
          color: 'bg-orange-600 hover:bg-orange-700',
          icon: '🍳'
        };
      case 'preparing':
        return {
          label: 'Ship All Orders',
          action: () => handleBulkStatusUpdate('preparing', 'shipped'), 
          color: 'bg-purple-600 hover:bg-purple-700',
          icon: '📦'
        };
      case 'shipped':
        return {
          label: 'Mark All Delivered',
          action: () => handleBulkStatusUpdate('shipped', 'delivered'),
          color: 'bg-green-600 hover:bg-green-700', 
          icon: '✅'
        };
      default:
        return null;
    }
  };

  // Handle order row click to show details modal
  const handleOrderRowClick = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Close order modal
  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Compact Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">
                {stats?.totalOrders || 0}
              </p>
            </div>
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
            </div>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Pending Orders</p>
              <p className="text-xl font-bold text-gray-900">
                {stats?.pendingOrders || 0}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Completed Orders</p>
              <p className="text-xl font-bold text-gray-900">
                {stats?.completedOrders || 0}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm transition-all duration-200 ${
              searchTerm !== debouncedSearchTerm ? 'bg-yellow-50 border-yellow-300' : 'bg-white'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
          {searchTerm !== debouncedSearchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2" title="Searching...">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Chrome-style Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {statusTabs.map((tab, index) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                activeTab === tab.key
                  ? 'text-gray-900 bg-white border-b-2 border-gray-900'
                  : 'text-gray-600 bg-gray-50 hover:text-gray-900 hover:bg-gray-100'
              } ${
                index !== statusTabs.length - 1 ? 'border-r border-gray-200' : ''
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full min-w-[1.5rem] ${
                  activeTab === tab.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Content */}
      <div className="w-full">

        {/* Bulk Actions & Product Aggregation */}
        {orders.length > 0 && (
          <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bulk Action Button */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bulk Actions ({orders.length} orders)
              </h3>
              {getBulkActionConfig() && (
                <button
                  onClick={getBulkActionConfig()?.action}
                  disabled={loading}
                  className={`w-full px-4 py-3 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                    getBulkActionConfig()?.color
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
                >
                  <span className="mr-2">{getBulkActionConfig()?.icon}</span>
                  {loading ? 'Processing...' : getBulkActionConfig()?.label}
                </button>
              )}
            </div>

            {/* Product Aggregation */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Summary
              </h3>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {getProductAggregation().map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {product.quantity} units
                    </span>
                  </div>
                ))}
                {getProductAggregation().length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No products in {activeTab} orders
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr 
                      key={order._id} 
                      onClick={() => handleOrderRowClick(order)}
                      className="hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.userId?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.userId?.email || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items?.length || 0} item(s)
                        </div>
                        <div className="text-sm text-gray-500">
                          {truncateText(
                            order.items?.map(item => item.name).join(', ') || 'No items',
                            30
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(order.pricing?.total || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            e.stopPropagation(); // Prevent row click when changing status
                            handleUpdateOrderStatus(order._id, e.target.value);
                          }}
                          className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <option value="pending">Pending (New)</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} orders found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === 'pending' 
                      ? 'No new orders to process. Orders will appear here when customers place them.' 
                      : `No orders with status "${activeTab}" found. Try checking other tabs or create some test orders.`}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Debug: API authentication is working. Check console for detailed logs.
                  </p>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Ultra Compact Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={closeOrderModal}
        >
          <div 
            className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl max-w-md w-full max-w-[400px] shadow-2xl border border-white border-opacity-30 relative transform transition-all duration-300 mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glassmorphic Header */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Order #{selectedOrder.orderId}
                </h3>
                <p className="text-gray-600 text-sm">
                  {selectedOrder.userId?.name || 'Unknown Customer'}
                </p>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Items Summary */}
                <div className="bg-gray-50 bg-opacity-70 rounded-xl p-3 border border-gray-200 border-opacity-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Items ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700 truncate mr-3">{item.name}</span>
                        <span className="text-gray-900 font-medium whitespace-nowrap">
                          {item.quantity}x ₹{((item.price || 0) * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-sm text-center py-2">No items</p>
                    )}
                  </div>
                </div>

                {/* Total & Status */}
                <div className="flex justify-between items-center bg-green-50 bg-opacity-70 rounded-xl p-3 border border-green-200 border-opacity-50">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{selectedOrder.pricing?.total?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      selectedOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      selectedOrder.status === 'preparing' ? 'bg-orange-100 text-orange-700' :
                      selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Delivery Info (if available) */}
                {selectedOrder.shippingAddress && (
                  <div className="bg-amber-50 bg-opacity-70 rounded-xl p-3 border border-amber-200 border-opacity-50">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Delivery Address
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                      <p className="text-blue-600">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                )}

                {/* Close Instructions */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Click outside to close
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}