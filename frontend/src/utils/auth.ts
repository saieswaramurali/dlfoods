// Authentication utilities for managing auth state
import { api, API_CONFIG } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  authProvider: 'google';
  joinedDate: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Local storage keys
const AUTH_TOKEN_KEY = 'dlfoods_auth_token';
const USER_DATA_KEY = 'dlfoods_user_data';

export class AuthService {
  // Get stored auth data
  static getStoredAuthData(): { token: string | null; user: AuthUser | null } {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const userData = localStorage.getItem(USER_DATA_KEY);
      
      return {
        token,
        user: userData ? JSON.parse(userData) : null
      };
    } catch (error) {
      console.error('Error parsing stored auth data:', error);
      return { token: null, user: null };
    }
  }

  // Store auth data
  static setAuthData(token: string, user: AuthUser): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }

  // Clear auth data
  static clearAuthData(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  // Verify token with backend
  static async verifyToken(token: string): Promise<{ valid: boolean; user?: AuthUser }> {
    try {
      const response = await api.auth.verify(token);
      const data = await response.json();
      
      if (response.ok && data.success) {
        return { valid: true, user: data.data.user };
      }
      
      return { valid: false };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { valid: false };
    }
  }

  // Initialize Google OAuth
  static initiateGoogleAuth(): void {
    const googleAuthUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.GOOGLE}`;
    window.location.href = googleAuthUrl;
  }

  // Handle OAuth callback (called after redirect from Google)
  static async handleOAuthCallback(): Promise<{ success: boolean; error?: string }> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userParam = urlParams.get('user');

      if (!token || !userParam) {
        const error = urlParams.get('message') || 'Authentication failed';
        return { success: false, error };
      }

      const user = JSON.parse(decodeURIComponent(userParam));
      
      // Store auth data
      this.setAuthData(token, user);
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return { success: true };
    } catch (error) {
      console.error('OAuth callback handling failed:', error);
      return { success: false, error: 'Failed to process authentication' };
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await api.auth.logout();
    } catch (error) {
      console.error('Backend logout failed:', error);
    } finally {
      // Always clear local auth data
      this.clearAuthData();
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const { token } = this.getStoredAuthData();
    return !!token;
  }

  // Get current user
  static getCurrentUser(): AuthUser | null {
    const { user } = this.getStoredAuthData();
    return user;
  }

  // Refresh user data from backend
  static async refreshUserData(): Promise<AuthUser | null> {
    try {
      const response = await api.auth.getMe();
      const data = await response.json();
      
      if (response.ok && data.success) {
        const user = data.data.user;
        const { token } = this.getStoredAuthData();
        
        if (token) {
          this.setAuthData(token, user);
        }
        
        return user;
      }
      
      // If refresh fails, clear auth data
      this.clearAuthData();
      return null;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      this.clearAuthData();
      return null;
    }
  }
}

// Auth helper hooks and utilities
export const useAuthRedirect = () => {
  const handleGoogleLogin = () => {
    AuthService.initiateGoogleAuth();
  };

  const handleLogout = async () => {
    await AuthService.logout();
    window.location.reload(); // Refresh to reset app state
  };

  return { handleGoogleLogin, handleLogout };
};

// Check if current page is auth callback
export const isAuthCallbackPage = (): boolean => {
  return window.location.pathname === '/auth/success' || 
         window.location.search.includes('token=');
};

export default AuthService;