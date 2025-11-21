import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, MapPin, Package, Shield, Phone } from 'lucide-react';

export default function ShippingPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Information</h1>
            <p className="text-gray-600">Everything you need to know about our delivery services</p>
          </div>
        </div>

        {/* Shipping Options */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Delivery Options</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard Delivery</h3>
              <p className="text-gray-600 mb-3">2-4 business days</p>
              <p className="text-sm text-gray-500">Free on orders above ₹500</p>
              <p className="text-sm text-gray-500">₹50 for orders below ₹500</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Express Delivery</h3>
              <p className="text-gray-600 mb-3">1-2 business days</p>
              <p className="text-sm text-gray-500">₹100 additional charge</p>
              <p className="text-sm text-gray-500">Available in major cities</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Same Day Delivery</h3>
              <p className="text-gray-600 mb-3">Within 6 hours</p>
              <p className="text-sm text-gray-500">₹200 additional charge</p>
              <p className="text-sm text-gray-500">Available in select areas</p>
            </div>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Delivery Coverage</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Standard & Express Delivery</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• All major cities across India</li>
                <li>• Tier 1 & Tier 2 cities</li>
                <li>• Over 15,000+ pin codes covered</li>
                <li>• Remote areas (additional 1-2 days)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Same Day Delivery</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Mumbai, Delhi, Bangalore</li>
                <li>• Chennai, Hyderabad, Pune</li>
                <li>• Kolkata, Ahmedabad, Jaipur</li>
                <li>• Selected areas within these cities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shipping Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How Shipping Works</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Processing</h3>
                <p className="text-gray-600">We process your order within 2-4 hours of confirmation. You'll receive an order confirmation email immediately.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Packaging</h3>
                <p className="text-gray-600">Your items are carefully packed with eco-friendly materials to ensure freshness and prevent damage during transit.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Dispatch</h3>
                <p className="text-gray-600">Once dispatched, you'll receive tracking information via SMS and email to monitor your order's progress.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delivery</h3>
                <p className="text-gray-600">Our delivery partner will contact you before delivery. Please ensure someone is available to receive the order.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Special Handling</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fresh Products</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Temperature-controlled packaging</li>
                <li>• Dry ice for frozen items</li>
                <li>• Delivered within expiry dates</li>
                <li>• Quality guarantee on arrival</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Supplements</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Moisture-proof packaging</li>
                <li>• Protected from direct sunlight</li>
                <li>• Batch numbers tracked</li>
                <li>• Minimum 75% shelf life</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Track Your Order</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 mb-3">You can track your order using:</p>
            <ul className="space-y-2 text-gray-600">
              <li>• Order tracking link in SMS/Email</li>
              <li>• "My Orders" section in your account</li>
              <li>• Customer support: 1800-123-4567</li>
              <li>• WhatsApp: +91-98765-43210</li>
            </ul>
          </div>
        </div>

        {/* Contact for Shipping Issues */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Shipping Issues?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            If you face any issues with your delivery or need to reschedule, please contact our support team immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/support/contact"
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors text-center"
            >
              Contact Support
            </Link>
            <a
              href="tel:+918012345678"
              className="border border-amber-600 text-amber-600 px-6 py-2 rounded-lg hover:bg-amber-50 transition-colors text-center"
            >
              Call: 1800-123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}