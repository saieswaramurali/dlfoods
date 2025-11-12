// NAVBAR DESIGN STYLES - Easy to switch between:
// Current: Floating rounded navbar with curved edges and rich brownish gradient, compact pill-shaped indicators
// Alternative: Full-width navbar (remove mx-4 mt-3 and rounded-full classes) with same gradient theme

import { ShoppingCart, User, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import LoginModal from './LoginModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Navbar() {
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const isActive = (path: string) => {
    if (path === '#home') return location.pathname === '/';
    if (path === '#products') return location.pathname === '/products' || location.pathname.startsWith('/product/');
    return false;
  };

  const handleNavClick = (section: string) => {
    if (location.pathname === '/') {
      // If we're on home page, scroll to section
      const element = document.getElementById(section.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-amber-900 via-amber-800 to-yellow-800 shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 py-3">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-all duration-300 hover:scale-105">
              <img src={logo} alt="DL Foods Logo" className="h-16 w-16" />
            </Link>
          </div>          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                isActive('#home') 
                  ? 'bg-amber-200 text-amber-900 font-medium shadow-md' 
                  : 'text-amber-100 hover:text-white hover:bg-amber-700/30'
              }`}
              onClick={() => handleNavClick('#home')}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                isActive('#products') 
                  ? 'bg-amber-200 text-amber-900 font-medium shadow-md' 
                  : 'text-amber-100 hover:text-white hover:bg-amber-700/30'
              }`}
            >
              Products
            </Link>
            <Link 
              to="/#about" 
              className="px-4 py-2 rounded-full text-amber-100 hover:text-white hover:bg-amber-700/30 transition-all duration-300"
              onClick={() => handleNavClick('#about')}
            >
              About
            </Link>
            <Link 
              to="/#contact" 
              className="px-4 py-2 rounded-full text-amber-100 hover:text-white hover:bg-amber-700/30 transition-all duration-300"
              onClick={() => handleNavClick('#contact')}
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/cart"
              className="relative p-2 hover:bg-amber-700/30 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-amber-100" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-200 text-amber-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center space-x-2 p-2 hover:bg-amber-700/30 rounded-lg transition-colors"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-amber-900" />
                    </div>
                  )}
                  <span className="text-amber-100 font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-amber-100" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    
                    <Link 
                      to="/profile?tab=orders"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    
                    <Link 
                      to="/profile?tab=settings"
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Link>
                    
                    <hr className="my-2" />
                    
                    <button 
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors w-full text-left"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="flex items-center space-x-2 bg-amber-200 text-amber-900 px-4 py-2 rounded-full hover:bg-amber-100 transition-colors font-medium shadow-md"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
}
