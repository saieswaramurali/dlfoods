import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthSuccessPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const processAuth = () => {
      try {
        // Extract token and user data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userDataString = urlParams.get('user');

        if (token && userDataString) {
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          // Parse and store user data
          const userData = JSON.parse(decodeURIComponent(userDataString));
          
          // Update auth context
          if (setUser) {
            setUser(userData);
          }

          console.log('Auth Success - Token stored:', !!token);
          console.log('Auth Success - User data:', userData);

          // Redirect to home page
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          console.error('Missing token or user data in URL');
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (error) {
        console.error('Auth processing error:', error);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    };

    processAuth();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Signing you in...
        </h1>
        <p className="text-gray-600">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}