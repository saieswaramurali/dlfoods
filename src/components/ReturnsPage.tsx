import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Clock, Phone, Package } from 'lucide-react';

export default function ReturnsPage() {
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
              <RotateCcw className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Returns & Refunds</h1>
            <p className="text-gray-600">Our hassle-free return policy for your peace of mind</p>
          </div>
        </div>

        {/* Return Policy Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Return Policy</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">7-Day Return</h3>
              <p className="text-gray-600">Easy returns within 7 days of delivery for eligible items</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Pickup</h3>
              <p className="text-gray-600">We arrange free pickup from your doorstep</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Refund</h3>
              <p className="text-gray-600">Refunds processed within 5-7 business days</p>
            </div>
          </div>
        </div>

        {/* What Can Be Returned */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Return Eligibility</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Returnable Items</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Packaged supplements in original sealed condition</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Non-perishable items with original packaging</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Items damaged during shipping</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Wrong items delivered</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Items past expiry date on delivery</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Non-Returnable Items</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Fresh/perishable items (unless damaged on arrival)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Opened or consumed products</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Items without original packaging</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Personalized or customized items</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                  <span>Items returned after 7 days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">How to Return Items</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Initiate Return</h3>
                <p className="text-gray-600">Login to your account, go to "My Orders", select the order and click "Return Item". Or contact our support team.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Choose Reason</h3>
                <p className="text-gray-600">Select the reason for return from the dropdown menu and provide additional details if needed.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Schedule Pickup</h3>
                <p className="text-gray-600">We'll arrange a free pickup from your address within 24-48 hours. You'll receive pickup confirmation via SMS.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pack Items</h3>
                <p className="text-gray-600">Pack items in original packaging with all accessories, tags, and invoice. Our delivery partner will collect them.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Refund Processing</h3>
                <p className="text-gray-600">Once we receive and verify the items, refund will be processed to your original payment method within 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Refund Information</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Payment Method</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Refund Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-gray-600">Credit/Debit Card</td>
                  <td className="py-3 px-4 text-gray-600">5-7 business days</td>
                  <td className="py-3 px-4 text-gray-600">Refunded to original card</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">UPI/Digital Wallet</td>
                  <td className="py-3 px-4 text-gray-600">1-3 business days</td>
                  <td className="py-3 px-4 text-gray-600">Instant to wallet</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">Net Banking</td>
                  <td className="py-3 px-4 text-gray-600">5-7 business days</td>
                  <td className="py-3 px-4 text-gray-600">Credited to bank account</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-600">Cash on Delivery</td>
                  <td className="py-3 px-4 text-gray-600">7-10 business days</td>
                  <td className="py-3 px-4 text-gray-600">Bank transfer required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Exchange Policy</h3>
          <p className="text-gray-600 mb-3">
            Currently, we don't offer direct exchanges. However, you can return the item and place a new order for the desired product.
          </p>
          <p className="text-gray-600">
            For faster processing, place the new order first and then initiate a return for the unwanted item.
          </p>
        </div>

        {/* Contact for Returns */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Need Help with Returns?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our customer support team is available to assist you with any return-related queries.
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
            <a
              href="mailto:returns@dlfoods.com"
              className="border border-amber-600 text-amber-600 px-6 py-2 rounded-lg hover:bg-amber-50 transition-colors text-center"
            >
              returns@dlfoods.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}