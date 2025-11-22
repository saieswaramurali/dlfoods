import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MessageCircle, 
  LogOut
} from 'lucide-react';
import logo from '../assets/logo.png';

interface AdminLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/orders', icon: Package },
    { name: 'Contacts', href: '/contacts', icon: MessageCircle },
  ];

  const adminUser = JSON.parse(localStorage.getItem('dlfoods_admin_user') || '{}');

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar - Always visible */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-700 shadow-md flex flex-col">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <img src={logo} alt="DL Foods" className="w-12 h-12 rounded-lg" />
        </div>

        <nav className="mt-8 px-4 flex-1">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-600 text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {adminUser.name || 'Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-700"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - always offset by sidebar */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top spacing */}
        <div className="h-8 bg-gray-50"></div>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}