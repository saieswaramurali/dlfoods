// Simple admin authentication
export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export class AdminAuth {
  // Hardcoded credentials for development - matching .env file
  private static readonly ADMIN_USERNAME = 'dlfoods_admin';
  private static readonly ADMIN_PASSWORD = 'dlf2024secure!';
  
  static authenticate(credentials: AdminCredentials): Promise<{ success: boolean; token?: string; user?: AdminUser; message?: string }> {
    console.log('Authenticating with:', credentials.username);
    console.log('Expected username:', this.ADMIN_USERNAME);
    console.log('Expected password:', this.ADMIN_PASSWORD);
    
    return new Promise((resolve) => {
      if (credentials.username === this.ADMIN_USERNAME && credentials.password === this.ADMIN_PASSWORD) {
        const token = this.generateToken();
        const user: AdminUser = {
          name: 'DL Foods Admin',
          email: 'admin@dlfoods.com',
          role: 'administrator'
        };
        
        console.log('Authentication successful, token:', token);
        resolve({ success: true, token, user });
      } else {
        console.log('Authentication failed');
        resolve({ success: false, message: 'Invalid username or password' });
      }
    });
  }

  static verifyToken(token: string): Promise<boolean> {
    console.log('Verifying token:', token);
    return new Promise((resolve) => {
      if (token && token.startsWith('dlf_admin_token_')) {
        console.log('Token verification successful');
        resolve(true);
      } else {
        console.log('Token verification failed');
        resolve(false);
      }
    });
  }

  private static generateToken(): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `dlf_admin_token_${timestamp}_${randomStr}`;
  }
}

export default AdminAuth;