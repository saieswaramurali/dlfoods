import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProfilePage from './components/ProfilePage';
import FAQPage from './components/FAQPage';
import ShippingPage from './components/ShippingPage';
import ReturnsPage from './components/ReturnsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import ContactSupportPage from './components/ContactSupportPage';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

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
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen">
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/invoice/:orderNumber" element={<InvoicePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/support/faq" element={<FAQPage />} />
                <Route path="/support/shipping" element={<ShippingPage />} />
                <Route path="/support/returns" element={<ReturnsPage />} />
                <Route path="/support/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/support/contact" element={<ContactSupportPage />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
