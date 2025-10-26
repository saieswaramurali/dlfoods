import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';

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
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
