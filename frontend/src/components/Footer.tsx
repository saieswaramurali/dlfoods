import { Facebook, Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img src={logo} alt="DL Foods Logo" className="h-16 w-16" />
            </div>
            <p className="text-gray-400">
              Premium nutrition for women 25+. Empowering your wellness journey.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-amber-400 transition-colors">Products</Link></li>
              <li><Link to="/#about" className="text-gray-400 hover:text-amber-400 transition-colors">About</Link></li>
              <li><Link to="/#contact" className="text-gray-400 hover:text-amber-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/support/faq" className="text-gray-400 hover:text-amber-400 transition-colors">FAQ</Link></li>
              <li><Link to="/support/shipping" className="text-gray-400 hover:text-amber-400 transition-colors">Shipping</Link></li>
              <li><Link to="/support/returns" className="text-gray-400 hover:text-amber-400 transition-colors">Returns</Link></li>
              <li><Link to="/support/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1EpDW1ugqD/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/dl_foodproducts?igsh=a2RnMTZxNTllcmUx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/919500337355" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors" title="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors" title="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 DL Foods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
