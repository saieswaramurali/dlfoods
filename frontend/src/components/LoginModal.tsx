import { useState } from 'react';
import { User, X, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setLoading(true);
    // Close modal before redirecting to Google OAuth
    onClose();
    
    // Initiate Google OAuth flow
    login();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl relative transform transition-all duration-300 mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          disabled={loading}
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome to DL Foods
            </h2>
            <p className="text-gray-600 text-lg">
              Sign in with your Google account to continue
            </p>
          </div>

          <div className="space-y-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-4 py-4 px-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader className="w-6 h-6 animate-spin text-amber-600" />
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-gray-700 font-semibold text-lg group-hover:text-gray-900 transition-colors">
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}