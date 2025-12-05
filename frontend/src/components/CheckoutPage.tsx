import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, Mail, User, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToastContext } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { getProductImageWithFallback } from '../utils/productImages';
import { api } from '../utils/api';

// Declare Razorpay type for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface AddressForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
  'Andaman and Nicobar Islands'
];

export default function CheckoutPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { showSuccess, showError } = useToastContext();
  const { user, isLoading: authLoading, addOrder } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');
  const [addressForm, setAddressForm] = useState<AddressForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validatePincode = (pincode: string): boolean => {
    const pincodeRegex = /^[1-9][0-9]{5}$/; // Indian pincode format
    return pincodeRegex.test(pincode);
  };

  const validateAddressForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!addressForm.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!addressForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(addressForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!addressForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(addressForm.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!addressForm.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!addressForm.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!addressForm.state) {
      newErrors.state = 'Please select a state';
    }

    if (!addressForm.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(addressForm.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    return newErrors;
  };

  const subtotal = cart.subtotal || 0;

  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAddressForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(2); // Go directly to Review & Pay
    }
  };

  const handleOrderComplete = async () => {
    // Check auth state
    const token = localStorage.getItem('token');
    console.log('Checkout Debug:', { 
      hasUser: !!user, 
      hasToken: !!token,
      userName: user?.name 
    });
    
    if (!user || !token) {
      showError('Please make sure you are logged in and try again.');
      return;
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      showError('Payment gateway not loaded. Please refresh the page and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Validate forms
      const addressErrors = validateAddressForm();
      
      if (Object.keys(addressErrors).length > 0) {
        setErrors(addressErrors);
        setIsProcessing(false);
        return;
      }

      // Step 1: Get Razorpay key
      const keyResponse = await api.payments.getKey();
      const keyData = await keyResponse.json();
      
      if (!keyData.success) {
        throw new Error('Failed to initialize payment gateway');
      }

      // Step 2: Create order on backend
      const orderData = {
        shippingAddress: {
          fullName: addressForm.fullName,
          address: addressForm.address,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode,
          phone: addressForm.phone
        },
        notes: notes
      };

      const createOrderResponse = await api.payments.createOrder(orderData);
      const createOrderData = await createOrderResponse.json();

      if (!createOrderData.success) {
        throw new Error(createOrderData.message || 'Failed to create order');
      }

      const { razorpayOrderId, amount, currency, orderId } = createOrderData.data;

      // Step 3: Open Razorpay payment modal
      const razorpayOptions = {
        key: keyData.data.key,
        amount: amount,
        currency: currency,
        name: 'DL FOODS',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Step 4: Verify payment on backend
            const verifyResponse = await api.payments.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId
            });
            
            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Payment successful - clear cart and redirect
              await clearCart();
              showSuccess(`🎉 Payment successful! Order ID: ${orderId}`, 5000);
              navigate(`/orders/${orderId}`);
            } else {
              showError(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            showError('Payment verification failed. Please contact support if amount was deducted.');
          }
        },
        prefill: {
          name: addressForm.fullName,
          email: addressForm.email,
          contact: addressForm.phone
        },
        notes: {
          orderId: orderId,
          address: `${addressForm.address}, ${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}`
        },
        theme: {
          color: '#d97706' // Amber-600 color
        },
        modal: {
          ondismiss: async function() {
            // User closed modal without completing payment
            showError('Payment was cancelled. Your order is saved and can be completed later.');
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      
      // Handle payment failure
      razorpay.on('payment.failed', async function (response: any) {
        console.error('Payment failed:', response.error);
        
        // Record failed payment on backend
        try {
          await api.payments.failed({
            orderId: orderId,
            razorpayOrderId: razorpayOrderId,
            error: {
              code: response.error.code,
              description: response.error.description,
              reason: response.error.reason
            }
          });
        } catch (err) {
          console.error('Failed to record payment failure:', err);
        }
        
        showError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      razorpay.open();

    } catch (error) {
      console.error('Order placement error:', error);
      if (error instanceof Error && error.message.includes('Authentication')) {
        return;
      }
      showError(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link to="/products" className="text-amber-600 hover:text-amber-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps - Simplified to 2 steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="font-medium">Delivery Address</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200'}`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="font-medium">Review & Pay</span>
            </div>
          </div>
        </div>

        <div className={`grid gap-8 ${currentStep === 1 ? 'lg:grid-cols-3' : 'max-w-3xl mx-auto'}`}>
          {/* Main Content */}
          <div className={currentStep === 1 ? 'lg:col-span-2' : ''}>
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="w-6 h-6 text-amber-600 mr-2" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={addressForm.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setAddressForm({...addressForm, phone: value});
                          }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your 10-digit mobile number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={addressForm.email}
                        onChange={(e) => setAddressForm({...addressForm, email: e.target.value})}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
                    <textarea
                      required
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="House no, Building name, Street name, Area"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <select
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.pincode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setAddressForm({...addressForm, pincode: value});
                        }}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                          errors.pincode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Continue to Review & Pay
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-4">Review & Pay</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Delivery Address Summary */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                        Delivery Address
                      </h3>
                      <button 
                        onClick={() => setCurrentStep(1)}
                        className="text-amber-600 text-xs hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      <span className="font-medium">{addressForm.fullName}</span><br />
                      {addressForm.address}, {addressForm.city}<br />
                      {addressForm.state} - {addressForm.pincode}<br />
                      Ph: {addressForm.phone}
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-sm mb-2">Price Details</h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className={shipping === 0 ? 'text-green-600' : ''}>
                          {shipping === 0 ? 'Free' : `₹${shipping}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-sm border-t pt-1.5 mt-1.5">
                        <span>Total</span>
                        <span className="text-amber-600">₹{total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items - Compact horizontal scroll */}
                <div className="mb-4">
                  <h3 className="font-medium text-sm mb-2">Order Items</h3>
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex-shrink-0 w-32 p-2 bg-gray-50 rounded-lg text-center">
                        <img 
                          src={getProductImageWithFallback(item.productId._id, item.productId.primaryImage)} 
                          alt={item.productId.name} 
                          className="w-14 h-14 object-contain bg-white rounded-lg mx-auto mb-1" 
                        />
                        <p className="font-medium text-xs truncate">{item.productId.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity} • ₹{item.productId.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Security - Combined row */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center text-blue-900 text-sm">
                      <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Razorpay Secure Payment</span>
                        <p className="text-xs text-blue-700 mt-0.5">Cards, UPI, Net Banking, Wallets</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-4 text-xs text-gray-600">
                  <p>
                    By placing this order, you agree to our{' '}
                    <Link to="/terms" className="text-amber-600 hover:underline">Terms & Conditions</Link>,{' '}
                    <Link to="/privacy-policy" className="text-amber-600 hover:underline">Privacy Policy</Link>,{' '}
                    <Link to="/returns" className="text-amber-600 hover:underline">Return Policy</Link>, and{' '}
                    <Link to="/shipping" className="text-amber-600 hover:underline">Shipping Policy</Link>.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOrderComplete}
                    disabled={isProcessing}
                    className="flex-[2] bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Razorpay • ₹{total}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar - Only show on Step 1 */}
          {currentStep === 1 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-3">
                      <img 
                        src={getProductImageWithFallback(item.productId._id, item.productId.primaryImage)} 
                        alt={item.productId.name} 
                        className="w-12 h-12 object-contain bg-gray-50 rounded-lg" 
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productId.name}</p>
                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₹{item.productId.price}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.totalItems} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span className="text-amber-600">₹{total}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}