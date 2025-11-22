import { useState, useEffect } from 'react';
import { 
  Package, 
  Eye, 
  Search, 
  TrendingUp,
  DollarSign,
  Clock
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
    name: string;
    quantity: number;
    price: number;
  }>;
  pricing: {
    total: number;
    subtotal: number;
    shipping: number;
    tax: number;
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
  paymentDetails: {
    method: string;
    status: string;
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const ordersPerPage = 10;
  
  // Order status tabs
  const statusTabs = [
    { key: 'all', label: 'All Orders', count: stats?.totalOrders || 0 },
    { key: 'pending', label: 'Pending', count: stats?.pendingOrders || 0 },
    { key: 'confirmed', label: 'Confirmed', count: 0 },
    { key: 'preparing', label: 'Preparing', count: 0 },
    { key: 'shipped', label: 'Shipped', count: 0 },
    { key: 'delivered', label: 'Delivered', count: stats?.completedOrders || 0 },
    { key: 'cancelled', label: 'Cancelled', count: 0 },
    { key: 'refunded', label: 'Refunded', count: 0 }
  ];

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, activeTab]);
  
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: ordersPerPage,
        search: searchTerm,
        status: activeTab !== 'all' ? activeTab : undefined
      };
      
      const response = await adminApi.orders.getAll(params);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setOrders(data.data.orders || []);
        }
      } else {
        // Fallback to mock data if API fails
        console.log('API unavailable, using mock data');
        setOrders([
          {
            _id: '1',
            orderId: 'DL001',
            userId: { _id: '1', name: 'John Doe', email: 'john@email.com' },
            items: [{ name: 'Sample Product', price: 25.99, quantity: 2 }],
            pricing: { total: 51.98 },
            status: activeTab !== 'all' ? activeTab : 'pending',
            shippingAddress: { fullName: 'John Doe', email: 'john@email.com', phone: '+1234567890' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Fallback to empty array
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Stats will be fetched from dashboard API
      // Mock stats for now
      setStats({
        totalOrders: 156,
        pendingOrders: 23,
        completedOrders: 88,
        totalRevenue: 12450.75,
        todayOrders: 12,
        monthlyGrowth: 15.5
      });
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await adminApi.orders.updateStatus(orderId, newStatus);
      const data = await response.json();
      
      if (data.success) {
        fetchOrders(); // Refresh orders list
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">Manage customer orders, update status, and track performance</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="admin-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="admin-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="admin-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="admin-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="admin-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer name, or email..."
                  className="admin-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="admin-select md:w-48"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              className="admin-select md:w-48"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-card overflow-hidden">
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.userId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {truncateText(order.userId.email, 30)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.pricing.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getOrderStatusColor(order.status)} capitalize`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openOrderModal(order)}
                            className="text-amber-600 hover:text-amber-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            className="text-xs border rounded px-2 py-1"
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, orders.length)} orders
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="admin-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={orders.length < ordersPerPage}
              className="admin-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order Details - {selectedOrder.orderId}
                </h2>
                <button
                  onClick={closeOrderModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Name:</strong> {selectedOrder.userId.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.userId.email}</p>
                  </div>
                </div>

                {/* Order Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 ${getOrderStatusColor(selectedOrder.status)} capitalize`}>
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p><strong>Payment:</strong> {selectedOrder.paymentDetails.method}</p>
                    <p><strong>Created:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Name:</strong> {selectedOrder.shippingAddress.fullName}</p>
                    <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}</p>
                    <p><strong>City:</strong> {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                    <p><strong>Pincode:</strong> {selectedOrder.shippingAddress.pincode}</p>
                    <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p><strong>Subtotal:</strong> {formatCurrency(selectedOrder.pricing.subtotal)}</p>
                    <p><strong>Shipping:</strong> {formatCurrency(selectedOrder.pricing.shipping)}</p>
                    <p><strong>Tax:</strong> {formatCurrency(selectedOrder.pricing.tax)}</p>
                    <hr className="my-2" />
                    <p><strong>Total:</strong> {formatCurrency(selectedOrder.pricing.total)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeOrderModal}
                  className="admin-button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}