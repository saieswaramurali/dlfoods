import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users, Database, Phone } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">How we collect, use, and protect your personal information</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: October 27, 2025</p>
          </div>
        </div>

        {/* Privacy Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
          <p className="text-gray-600 mb-4">
            At DL Foods, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Transparent Data Use</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Lock className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">Secure Storage</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
              <Users className="w-6 h-6 text-amber-600" />
              <span className="text-sm font-medium text-amber-900">User Control</span>
            </div>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information You Provide</h3>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• Name, email address, and phone number</li>
                <li>• Shipping and billing addresses</li>
                <li>• Payment information (processed securely by our payment partners)</li>
                <li>• Account preferences and communication settings</li>
                <li>• Customer service communications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Information Collected Automatically</h3>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• Device information (IP address, browser type, operating system)</li>
                <li>• Website usage data (pages visited, time spent, click patterns)</li>
                <li>• Cookies and similar tracking technologies</li>
                <li>• Location information (with your permission)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Information from Third Parties</h3>
              <ul className="space-y-2 text-gray-600 ml-4">
                <li>• Social media platforms (when you choose to connect accounts)</li>
                <li>• Payment processors and fraud prevention services</li>
                <li>• Delivery partners for order fulfillment</li>
                <li>• Marketing partners (with your consent)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Delivery</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Process and fulfill your orders</li>
                <li>• Provide customer support</li>
                <li>• Send order confirmations and updates</li>
                <li>• Manage your account and preferences</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Send promotional emails (with consent)</li>
                <li>• Notify you about product updates</li>
                <li>• Respond to your inquiries</li>
                <li>• Share important policy changes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Improvement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Analyze website usage and performance</li>
                <li>• Improve our products and services</li>
                <li>• Develop new features</li>
                <li>• Conduct research and analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Security & Compliance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Prevent fraud and abuse</li>
                <li>• Ensure platform security</li>
                <li>• Comply with legal requirements</li>
                <li>• Protect user rights and safety</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-2">We DO NOT sell your personal information</h3>
              <p className="text-red-700">Your personal data is never sold to third parties for commercial purposes.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">We may share information with:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="font-medium text-gray-900 w-32 flex-shrink-0">Service Providers:</span>
                  <span>Payment processors, delivery partners, cloud storage providers (under strict data protection agreements)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium text-gray-900 w-32 flex-shrink-0">Legal Requirements:</span>
                  <span>Government authorities when required by law or to protect rights and safety</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium text-gray-900 w-32 flex-shrink-0">Business Transfer:</span>
                  <span>In case of merger, acquisition, or sale of assets (with user notification)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium text-gray-900 w-32 flex-shrink-0">With Consent:</span>
                  <span>Marketing partners or other third parties only with your explicit permission</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Data Security</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organizational measures to protect your personal information:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Measures</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• SSL encryption for data transmission</li>
                <li>• Encrypted data storage</li>
                <li>• Regular security audits</li>
                <li>• Secure payment processing</li>
                <li>• Access controls and authentication</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Organizational Measures</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Employee training on data protection</li>
                <li>• Limited access on need-to-know basis</li>
                <li>• Regular policy updates</li>
                <li>• Incident response procedures</li>
                <li>• Third-party security assessments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Your Rights</h2>
          </div>
          
          <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>

          <div className="space-y-4">
            <div className="border-l-4 border-amber-600 pl-4">
              <h3 className="font-semibold text-gray-900">Access & Portability</h3>
              <p className="text-gray-600">Request a copy of your personal data and transfer it to another service</p>
            </div>
            
            <div className="border-l-4 border-amber-600 pl-4">
              <h3 className="font-semibold text-gray-900">Correction</h3>
              <p className="text-gray-600">Update or correct inaccurate personal information</p>
            </div>
            
            <div className="border-l-4 border-amber-600 pl-4">
              <h3 className="font-semibold text-gray-900">Deletion</h3>
              <p className="text-gray-600">Request deletion of your personal data (subject to legal requirements)</p>
            </div>
            
            <div className="border-l-4 border-amber-600 pl-4">
              <h3 className="font-semibold text-gray-900">Opt-out</h3>
              <p className="text-gray-600">Unsubscribe from marketing communications at any time</p>
            </div>
            
            <div className="border-l-4 border-amber-600 pl-4">
              <h3 className="font-semibold text-gray-900">Restriction</h3>
              <p className="text-gray-600">Limit how we process your personal information</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-amber-800">
              To exercise these rights, contact us at <a href="mailto:privacy@dlfoods.com" className="underline">privacy@dlfoods.com</a> or use the contact information below.
            </p>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies & Tracking</h2>
          
          <p className="text-gray-600 mb-4">
            We use cookies and similar technologies to enhance your browsing experience:
          </p>

          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-900">Essential Cookies:</span>
              <span className="text-gray-600 ml-2">Required for website functionality and cannot be disabled</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Performance Cookies:</span>
              <span className="text-gray-600 ml-2">Help us understand how visitors interact with our website</span>
            </div>
            <div>
              <span className="font-medium text-gray-900">Marketing Cookies:</span>
              <span className="text-gray-600 ml-2">Used to deliver relevant advertisements (with your consent)</span>
            </div>
          </div>

          <p className="text-gray-600 mt-4">
            You can manage cookie preferences through your browser settings or our cookie banner when you first visit our site.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Phone className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Questions About Privacy?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-gray-600">
            <p><strong>Email:</strong> privacy@dlfoods.com</p>
            <p><strong>Phone:</strong> 1800-123-4567</p>
            <p><strong>Address:</strong> DL Foods Pvt. Ltd., 123 Business Park, Mumbai, Maharashtra 400001</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link
              to="/support/contact"
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors text-center"
            >
              Contact Support
            </Link>
            <a
              href="mailto:privacy@dlfoods.com"
              className="border border-amber-600 text-amber-600 px-6 py-2 rounded-lg hover:bg-amber-50 transition-colors text-center"
            >
              Email Privacy Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}