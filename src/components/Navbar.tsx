import { ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
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

  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-amber-700 hover:text-amber-800 transition-colors">
              DL Foods
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-amber-600 transition-colors ${isActive('#home') ? 'text-amber-600 font-medium' : 'text-gray-700'}`}
              onClick={() => handleNavClick('#home')}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`hover:text-amber-600 transition-colors ${isActive('#products') ? 'text-amber-600 font-medium' : 'text-gray-700'}`}
            >
              Products
            </Link>
            <Link 
              to="/#about" 
              className="text-gray-700 hover:text-amber-600 transition-colors"
              onClick={() => handleNavClick('#about')}
            >
              About
            </Link>
            <Link 
              to="/#contact" 
              className="text-gray-700 hover:text-amber-600 transition-colors"
              onClick={() => handleNavClick('#contact')}
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>
            <button className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
