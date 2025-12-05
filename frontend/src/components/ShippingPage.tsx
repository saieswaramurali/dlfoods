import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ShippingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Shipping Policy</h1>
          <p className="text-sm text-gray-500">Last updated: December 6, 2025</p>
        </div>

        <div className="text-sm leading-relaxed text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Shipping Coverage</h2>
            <p>
              We currently ship to all serviceable pin codes across India. Delivery is available in all major cities, towns, and most rural areas. Enter your pin code during checkout to verify delivery availability in your area.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Shipping Charges</h2>
            <table className="w-full border-collapse border border-gray-200 text-sm my-3">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Order Value</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Shipping Charge</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Above ₹500</td>
                  <td className="border border-gray-200 px-4 py-2">Free</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Below ₹500</td>
                  <td className="border border-gray-200 px-4 py-2">₹50</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Delivery Time</h2>
            <p className="mb-3">Estimated delivery times after order confirmation:</p>
            <table className="w-full border-collapse border border-gray-200 text-sm my-3">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Location</th>
                  <th className="border border-gray-200 px-4 py-2 text-left font-medium">Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Metro Cities</td>
                  <td className="border border-gray-200 px-4 py-2">2-4 business days</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Other Cities</td>
                  <td className="border border-gray-200 px-4 py-2">4-6 business days</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2">Remote Areas</td>
                  <td className="border border-gray-200 px-4 py-2">7-10 business days</td>
                </tr>
              </tbody>
            </table>
            <p className="text-gray-500">
              Note: Delivery times are estimates and may vary due to unforeseen circumstances, holidays, or weather conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Order Processing</h2>
            <p className="mb-3">
              Orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.
            </p>
            <p>You will receive an email with tracking information once your order is shipped.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Order Tracking</h2>
            <p>
              Once your order is dispatched, you will receive a tracking number via email and SMS. You can track your order status through your account on our website or by contacting our customer support.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Delivery Attempts</h2>
            <p className="mb-3">
              Our delivery partner will make up to 3 delivery attempts. If delivery is unsuccessful after 3 attempts, the order will be returned to us. In such cases:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>A refund will be initiated after deducting shipping charges</li>
              <li>You may contact us to arrange redelivery (additional charges may apply)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Damaged Packages</h2>
            <p>
              If you receive a damaged package, please do not accept it. If damage is noticed after accepting delivery, contact us within 24 hours with photographs of the damaged package and products. See our <Link to="/returns" className="text-gray-900 underline">Return Policy</Link> for more details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Contact Us</h2>
            <p>For shipping-related queries, please contact us:</p>
            <p className="mt-2">
              Email: contact@dlfoods.in<br />
              Phone: +91 99403 80475<br />
              Hours: Monday to Saturday, 9:00 AM - 6:00 PM IST
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
