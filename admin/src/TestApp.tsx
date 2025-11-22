import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';

// Simple test component to check if everything loads
function TestApp() {
  const [message] = useState('Admin Dashboard Test');

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' 
        }}>
          <h1 style={{ color: '#111827', marginBottom: '16px' }}>
            {message}
          </h1>
          <p style={{ color: '#6b7280' }}>
            All imports are working correctly!
          </p>
        </div>
      </div>
    </Router>
  );
}

export default TestApp;