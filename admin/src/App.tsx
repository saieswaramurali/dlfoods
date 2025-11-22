import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout.tsx';
import LoginPage from './components/LoginPage.tsx';
import Dashboard from './components/Dashboard.tsx';
import OrdersManagement from './components/OrdersManagement';
import ContactManagement from './components/ContactManagement';
import AdminAuth from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('dlfoods_admin_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const isValid = await AdminAuth.verifyToken(token);
      
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('dlfoods_admin_token');
        localStorage.removeItem('dlfoods_admin_user');
      }
    } catch (error) {
      // Authentication check failed - clear stored data
      localStorage.removeItem('dlfoods_admin_token');
      localStorage.removeItem('dlfoods_admin_user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token: string, user: any) => {
    localStorage.setItem('dlfoods_admin_token', token);
    localStorage.setItem('dlfoods_admin_user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('dlfoods_admin_token');
    localStorage.removeItem('dlfoods_admin_user');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            border: '2px solid transparent', 
            borderBottom: '2px solid #d97706',
            margin: '0 auto'
          }}></div>
          <p className="mt-4 text-gray-600">Loading DL Foods Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {!isAuthenticated ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <AdminLayout onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<OrdersManagement />} />
              <Route path="/contacts" element={<ContactManagement />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AdminLayout>
        )}
      </div>
    </Router>
  );
}

export default App;
