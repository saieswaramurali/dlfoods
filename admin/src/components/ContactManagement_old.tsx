import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Eye, 
  Search, 
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { adminApi } from '../utils/api';
import { 
  formatDate, 
  getContactStatusColor, 
  getPriorityColor,
  truncateText,
  generateReferenceNumber
} from '../utils/helpers';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  ipAddress?: string;
  userAgent?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  totalContacts: number;
  newContacts: number;
  resolvedContacts: number;
  averageResponseTime: number;
  todayContacts: number;
  monthlyGrowth: number;
}

export default function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  
  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  const contactsPerPage = 10;

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [currentPage, searchTerm, statusFilter, priorityFilter, subjectFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: contactsPerPage,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      
      const response = await adminApi.contacts.getAll(params);
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data.contacts);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Stats will be fetched from dashboard API
      // Mock stats for now
      setStats({
        totalContacts: 89,
        newContacts: 12,
        resolvedContacts: 54,
        averageResponseTime: 4.2,
        todayContacts: 8,
        monthlyGrowth: 12.3
      });
    } catch (error) {
      console.error('Failed to fetch contact stats:', error);
    }
  };

  const handleUpdateContactStatus = async (contactId: string, newStatus: string, notes?: string) => {
    try {
      const response = await adminApi.contacts.updateStatus(contactId, newStatus);
      const data = await response.json();
      
      if (data.success) {
        fetchContacts(); // Refresh contacts list
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus, adminNotes: notes });
        }
      }
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const openContactModal = (contact: Contact) => {
    setSelectedContact(contact);
    setAdminNotes(contact.adminNotes || '');
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setSelectedContact(null);
    setAdminNotes('');
  };

  const handleSaveNotes = () => {
    if (selectedContact) {
      handleUpdateContactStatus(selectedContact._id, selectedContact.status, adminNotes);
      closeContactModal();
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Management</h1>
          <p className="text-gray-600">Manage customer inquiries, support requests, and feedback</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="admin-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="admin-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newContacts}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="admin-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolvedContacts}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="admin-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}h</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="admin-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="admin-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              className="admin-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <select
              className="admin-select"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="all">All Subjects</option>
              <option value="general">General</option>
              <option value="product">Product</option>
              <option value="order">Order</option>
              <option value="shipping">Shipping</option>
              <option value="return">Return</option>
              <option value="wholesale">Wholesale</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
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
                      Loading contacts...
                    </td>
                  </tr>
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {truncateText(contact.email, 30)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Ref: {generateReferenceNumber(contact._id)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="admin-badge-blue capitalize">
                          {contact.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {truncateText(contact.message, 100)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getContactStatusColor(contact.status)} capitalize`}>
                          {contact.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getPriorityColor(contact.priority)} capitalize`}>
                          {contact.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openContactModal(contact)}
                            className="text-amber-600 hover:text-amber-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <select
                            className="text-xs border rounded px-2 py-1"
                            value={contact.status}
                            onChange={(e) => handleUpdateContactStatus(contact._id, e.target.value)}
                          >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
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
            Showing {((currentPage - 1) * contactsPerPage) + 1} to {Math.min(currentPage * contactsPerPage, contacts.length)} contacts
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
              disabled={contacts.length < contactsPerPage}
              className="admin-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Contact Details Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Contact Details - {generateReferenceNumber(selectedContact._id)}
                </h2>
                <button
                  onClick={closeContactModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Name:</strong> {selectedContact.name}</p>
                    <p><strong>Email:</strong> {selectedContact.email}</p>
                    <p><strong>Subject:</strong> 
                      <span className="ml-2 admin-badge-blue capitalize">
                        {selectedContact.subject}
                      </span>
                    </p>
                    <p><strong>Submitted:</strong> {formatDate(selectedContact.createdAt)}</p>
                  </div>
                </div>

                {/* Status Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Status Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Status:</strong> 
                      <span className={`ml-2 ${getContactStatusColor(selectedContact.status)} capitalize`}>
                        {selectedContact.status.replace('_', ' ')}
                      </span>
                    </p>
                    <p><strong>Priority:</strong> 
                      <span className={`ml-2 ${getPriorityColor(selectedContact.priority)} capitalize`}>
                        {selectedContact.priority}
                      </span>
                    </p>
                    <p><strong>Last Updated:</strong> {formatDate(selectedContact.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-800">{selectedContact.message}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
                <textarea
                  className="admin-input h-32 resize-none"
                  placeholder="Add internal notes about this contact..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {/* Technical Information */}
              {(selectedContact.ipAddress || selectedContact.userAgent) && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    {selectedContact.ipAddress && (
                      <p><strong>IP Address:</strong> {selectedContact.ipAddress}</p>
                    )}
                    {selectedContact.userAgent && (
                      <p><strong>User Agent:</strong> {truncateText(selectedContact.userAgent, 80)}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeContactModal}
                  className="admin-button-secondary"
                >
                  Cancel
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}&body=Dear ${selectedContact.name},%0D%0A%0D%0AThank you for contacting DL Foods.%0D%0A%0D%0A`}
                  className="admin-button"
                >
                  Reply via Email
                </a>
                <button
                  onClick={handleSaveNotes}
                  className="admin-button"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}