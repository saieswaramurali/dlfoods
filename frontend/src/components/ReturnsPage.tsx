import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ReturnsPage() {
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Return & Refund Policy</h1>
          <p className="text-sm text-gray-500">Last updated: December 6, 2025</p>
        </div>

        <div className="text-sm leading-relaxed text-gray-700 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. No Return Policy</h2>
            <p className="mb-3">
              Due to the nature of our food and nutrition products, we maintain a strict no-return policy for hygiene and safety reasons. However, we are committed to ensuring customer satisfaction and will address legitimate concerns.
            </p>
            <p className="font-medium text-gray-900">
              All sales are final. We do not accept returns for change of mind or incorrect orders placed by the customer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Exceptions</h2>
            <p className="mb-3">We will provide a replacement or refund only in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Product received is damaged during transit</li>
              <li>Wrong product delivered (different from what was ordered)</li>
              <li>Product received is expired or past its best-before date</li>
              <li>Product seal is broken or tampered upon delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Reporting Issues</h2>
            <p className="mb-3">To report any of the above issues:</p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>Contact us within 24 hours of delivery</li>
              <li>Provide your order number and description of the issue</li>
              <li>Include clear photographs showing the problem</li>
              <li>Do not discard the product until the issue is resolved</li>
            </ul>
            <p>
              Email: contact@dlfoods.in<br />
              Phone: +91 99403 80475
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Refund Process</h2>
            <p className="mb-3">If your claim is approved:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Refunds will be processed within 5-7 business days</li>
              <li>Amount will be credited to the original payment method</li>
              <li>For UPI/Net Banking payments, refund may take additional 3-5 days to reflect</li>
              <li>You will receive an email confirmation once the refund is initiated</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Non-Refundable Items</h2>
            <p className="mb-3">The following are not eligible for refund:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Products returned due to change of mind</li>
              <li>Products with broken seals (unless reported at delivery)</li>
              <li>Products not in original packaging</li>
              <li>Issues reported after 24 hours of delivery</li>
              <li>Shipping charges (unless the error was on our part)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Cancellations</h2>
            <p className="mb-3">
              Orders can be cancelled only before they are shipped. Once an order is dispatched, it cannot be cancelled.
            </p>
            <p>
              To cancel an order, contact us immediately with your order number. If the order has not been processed, we will cancel it and initiate a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Contact Us</h2>
            <p>For any questions regarding our return and refund policy, please contact our customer support team:</p>
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
