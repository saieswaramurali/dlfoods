import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext, useContext, ReactNode } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import InvoicePage from './components/InvoicePage';
import OrderDetailsPage from './components/OrderDetailsPage';
import ProfilePage from './components/ProfilePage';
import FAQPage from './components/FAQPage';
import ShippingPage from './components/ShippingPage';
import ReturnsPage from './components/ReturnsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ContactSupportPage from './components/ContactSupportPage';
import AuthSuccessPage from './pages/AuthSuccessPage';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

// Login Modal Context
interface LoginModalContextType {
  openLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within LoginModalProvider');
  }
  return context;
};

interface LoginModalProviderProps {
  children: ReactNode;
  openModal: () => void;
}

function LoginModalProvider({ children, openModal }: LoginModalProviderProps) {
  return (
    <LoginModalContext.Provider value={{ openLoginModal: openModal }}>
      {children}
    </LoginModalContext.Provider>
  );
}

// Home page component
function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <About />
      <Contact />
    </>
  );
}

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <LoginModalProvider openModal={openLoginModal}>
            <Router>
              <div className="min-h-screen">
                <Navbar 
                  isLoginModalOpen={isLoginModalOpen}
                  onLoginModalClose={closeLoginModal}
                  onLoginModalOpen={openLoginModal}
                />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
                  <Route path="/invoice/:orderNumber" element={<InvoicePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/auth/success" element={<AuthSuccessPage />} />
                  <Route path="/support/faq" element={<FAQPage />} />
                  <Route path="/support/shipping" element={<ShippingPage />} />
                  <Route path="/support/returns" element={<ReturnsPage />} />
                  <Route path="/support/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/support/contact" element={<ContactSupportPage />} />
                  {/* Catch-all route for unmatched paths */}
                  <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                        <button 
                          onClick={() => window.location.href = '/'}
                          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
                        >
                          Go Home
                        </button>
                      </div>
                    </div>
                  } />
                </Routes>
                <Footer />
              </div>
            </Router>
          </LoginModalProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
