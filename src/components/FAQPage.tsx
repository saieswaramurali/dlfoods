import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: 'Orders',
    question: 'How do I place an order?',
    answer: 'You can place an order by browsing our products, adding items to your cart, and proceeding to checkout. You can complete your purchase as a guest or create an account for faster future orders.'
  },
  {
    id: 2,
    category: 'Orders',
    question: 'Can I modify or cancel my order?',
    answer: 'You can modify or cancel your order within 30 minutes of placing it. After this time, your order goes into preparation and cannot be changed. Contact our support team immediately if you need assistance.'
  },
  {
    id: 3,
    category: 'Orders',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI payments, net banking, and digital wallets. We also offer cash on delivery for orders above ₹200.'
  },
  {
    id: 4,
    category: 'Shipping',
    question: 'What are your delivery charges?',
    answer: 'We offer free delivery on orders above ₹500. For orders below ₹500, a delivery charge of ₹50 applies. Same-day delivery is available in select cities for an additional charge.'
  },
  {
    id: 5,
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 2-4 business days. Express delivery (1-2 days) and same-day delivery are available in select cities. You will receive tracking information once your order is dispatched.'
  },
  {
    id: 6,
    category: 'Shipping',
    question: 'Do you deliver to my area?',
    answer: 'We deliver across India to most pin codes. You can check delivery availability by entering your pin code at checkout. We are constantly expanding our delivery network.'
  },
  {
    id: 7,
    category: 'Products',
    question: 'Are your products suitable for women with dietary restrictions?',
    answer: 'Yes, our products cater to various dietary needs. We offer gluten-free, vegan, keto-friendly, and diabetic-friendly options. Check product descriptions for detailed ingredient lists and nutritional information.'
  },
  {
    id: 8,
    category: 'Products',
    question: 'How should I store the products?',
    answer: 'Store products in a cool, dry place away from direct sunlight. Refrigerated items should be stored between 2-8°C. Check individual product labels for specific storage instructions.'
  },
  {
    id: 9,
    category: 'Products',
    question: 'What is the shelf life of your products?',
    answer: 'Shelf life varies by product type. Fresh items: 3-7 days, packaged items: 6-12 months. All products show manufacturing and expiry dates. We ensure minimum 75% shelf life for all delivered products.'
  },
  {
    id: 10,
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We accept returns within 7 days of delivery for non-perishable items in original packaging. Fresh/perishable items can only be returned if damaged or expired upon delivery.'
  },
  {
    id: 11,
    category: 'Returns',
    question: 'How do I initiate a return?',
    answer: 'Go to "My Orders" in your account, select the order, and click "Return Item". You can also contact our support team. We will arrange pickup and process your refund within 5-7 business days.'
  },
  {
    id: 12,
    category: 'Account',
    question: 'How do I create an account?',
    answer: 'Click on "Login" in the top navigation and select "Sign up". You can register using your email or Google account. Having an account allows you to track orders, save addresses, and enjoy faster checkout.'
  },
  {
    id: 13,
    category: 'Account',
    question: 'I forgot my password. What should I do?',
    answer: 'Click on "Forgot Password" on the login page. Enter your email address and we will send you instructions to reset your password. For demo purposes, you can use password: 123456'
  },
  {
    id: 14,
    category: 'Health',
    question: 'Are your products safe during pregnancy?',
    answer: 'While our products are made from natural ingredients, we recommend consulting with your doctor before consuming any nutritional supplements during pregnancy or breastfeeding.'
  },
  {
    id: 15,
    category: 'Health',
    question: 'Can I take multiple products together?',
    answer: 'Most of our products can be combined safely. However, we recommend consulting with a healthcare professional or our nutrition experts for personalized advice on product combinations.'
  }
];

const categories = ['All', 'Orders', 'Shipping', 'Products', 'Returns', 'Account', 'Health'];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <HelpCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
            <p className="text-gray-600">Find answers to common questions about DL Foods</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredFAQs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredFAQs.map((item) => (
                <div key={item.id} className="p-6">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-lg p-2 -m-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                    </div>
                    <div className="ml-4">
                      {openItems.includes(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {openItems.includes(item.id) && (
                    <div className="mt-4 pl-2">
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No questions found matching your search.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Still have questions?</h3>
            <p className="text-gray-600 mb-4">Our support team is here to help you 24/7</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/support/contact"
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@dlfoods.com"
                className="border border-amber-600 text-amber-600 px-6 py-2 rounded-lg hover:bg-amber-50 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}