import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { useToastContext } from '../context/ToastContext';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToastContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      showError('Please fill in all required fields');
      return;
    }

    // Check word count
    const wordCount = formData.message.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 5) {
      showError('Message must be at least 5 words');
      return;
    }
    if (wordCount > 400) {
      showError('Message cannot exceed 400 words');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess('Message sent successfully! We\'ll get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Email</h4>
                <p className="text-gray-600">support@dlfoods.com</p>
                <p className="text-sm text-gray-500">We respond within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Phone</h4>
                <p className="text-gray-600">+91 98765 43210</p>
                <p className="text-sm text-gray-500">Mon-Sat, 9:00 AM - 7:00 PM</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Location</h4>
                <div className="text-gray-600 space-y-1">
                  <p>United Kingdom</p>
                  <p>London, England</p>
                  <p>Shipping Worldwide</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex-shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">Quick Help</h4>
                <p className="text-gray-600 mb-2">Need immediate assistance?</p>
                <a
                  href="/support/faq"
                  className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
                >
                  Check our FAQ
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="product">Product Question</option>
                <option value="order">Order Support</option>
                <option value="shipping">Shipping & Delivery</option>
                <option value="return">Returns & Refunds</option>
                <option value="wholesale">Wholesale Inquiry</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">(5-400 words)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                placeholder="Tell us how we can help you... (minimum 5 words, maximum 400 words)"
                required
              ></textarea>
              <div className="text-xs text-gray-400 mt-1">
                {formData.message.trim().split(/\s+/).filter(word => word.length > 0).length} words
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              {!isSubmitting && <Send className="w-5 h-5" />}
            </button>

            <p className="text-sm text-gray-500 text-center">
              We typically respond within 24 hours during business hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
