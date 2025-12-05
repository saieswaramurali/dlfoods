import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-sm text-gray-500">Last updated: December 6, 2025</p>
        </div>

        <div className="text-sm leading-relaxed text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using the DL Foods website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Products and Pricing</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All product descriptions, images, and prices are subject to change without notice</li>
              <li>We reserve the right to limit quantities of any products</li>
              <li>Prices displayed are in Indian Rupees (INR) and include applicable taxes unless stated otherwise</li>
              <li>We reserve the right to refuse or cancel any order for any reason</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Orders and Payment</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>By placing an order, you represent that you are at least 18 years of age</li>
              <li>All payments are processed securely through Razorpay</li>
              <li>Orders are confirmed only after successful payment</li>
              <li>We are not responsible for payment failures due to bank or payment gateway issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Shipping and Delivery</h2>
            <p className="mb-3">
              Shipping and delivery are subject to our <Link to="/shipping" className="text-gray-900 underline">Shipping Policy</Link>. Delivery times are estimates and may vary based on location and other factors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Returns and Refunds</h2>
            <p>
              Returns and refunds are subject to our <Link to="/returns" className="text-gray-900 underline">Return & Refund Policy</Link>. Due to the nature of food products, we maintain a strict no-return policy except in specific circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree to provide accurate and complete information when creating an account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, images, and software, is the property of DL Foods and is protected by intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>
              DL Foods shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services. Our liability is limited to the amount paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Contact Us</h2>
            <p>For any questions regarding these Terms and Conditions, please contact us:</p>
            <p className="mt-2">
              Email: contact@dlfoods.in<br />
              Phone: +91 99403 80475
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
