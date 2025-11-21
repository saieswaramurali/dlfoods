# Development Setup Guide

## Environment Configuration

### 🔧 Backend Configuration

1. **Environment Files**:
   - `.env` - Development configuration
   - `.env.production.template` - Template for production

2. **Key Environment Variables**:
```bash
# Development (.env)
MONGODB_URI=mongodb+srv://your_atlas_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret
```

### 🎨 Frontend Configuration

1. **Environment Files**:
   - `.env` - Development (Vite loads automatically)
   - `.env.production` - Production build

2. **Key Environment Variables**:
```bash
# Development (.env)
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=DL Foods
VITE_APP_VERSION=1.0.0
```

## 🚀 API Integration Setup

### Development Mode
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- **Vite Proxy**: Automatically proxies `/api/*` and `/assets/*` to backend

### API Usage in Components
```typescript
import api from '../utils/api';

// Get products
const response = await api.products.getAll();
const data = await response.json();

// Add to cart
await api.cart.addItem(productId, quantity);

// Get user profile
const profile = await api.users.getProfile();
```

### Authentication Flow
```typescript
import AuthService from '../utils/auth';

// Login with Google
AuthService.initiateGoogleAuth();

// Check authentication
if (AuthService.isAuthenticated()) {
  const user = AuthService.getCurrentUser();
}

// Logout
await AuthService.logout();
```

## 📁 File Structure Conventions

### Frontend Assets
```
frontend/src/assets/
├── product_images/          # Product photos
│   ├── mixed masala mockup.png
│   ├── moringa.png
│   ├── nutribox mockup.png
│   └── turmeric .png
└── uploads/                # User uploaded files
```

### Backend Static Serving
- Frontend assets served at: `http://localhost:5000/assets/*`
- Product images: `http://localhost:5000/assets/product_images/`
- User uploads: `http://localhost:5000/assets/uploads/`

## 🔄 Development Workflow

### Starting Development
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Environment Setup Checklist
- [ ] MongoDB Atlas connection string in backend `.env`
- [ ] Google OAuth credentials configured
- [ ] Frontend `.env` with correct API base URL
- [ ] Backend CORS configured for frontend URL
- [ ] Static file serving enabled for assets

### API Testing
```bash
# Health check
curl http://localhost:5000/health

# Test CORS
curl -H "Origin: http://localhost:5173" http://localhost:5000/api/products

# Test static assets
curl http://localhost:5000/assets/product_images/moringa.png
```

## 🌐 Production Deployment

### Backend Environment
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod_connection_string
GOOGLE_CLIENT_ID=prod_google_client_id
GOOGLE_CLIENT_SECRET=prod_google_client_secret
CLIENT_URL=https://your-frontend-domain.com
FRONTEND_URLS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
JWT_SECRET=super_secure_production_jwt_secret
SESSION_SECRET=super_secure_production_session_secret
```

### Frontend Environment
```bash
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_APP_NAME=DL Foods
VITE_APP_VERSION=1.0.0
```

### Build Commands
```bash
# Backend - No build needed (Node.js)
npm start

# Frontend - Build for production
npm run build
npm run preview  # Test production build locally
```

## 🔧 Configuration Notes

### CORS Configuration
- Development: Permissive (allows all origins)
- Production: Restricted to specified domains
- Supports multiple frontend URLs for staging/production

### Authentication URLs
- Google OAuth initiation: `/api/auth/google`
- OAuth callback: `/api/auth/google/callback`
- Frontend success page: `/auth/success?token=...&user=...`

### Image Serving Strategy
- **Development**: Backend serves frontend assets
- **Production**: Consider CDN for better performance
- **Upload handling**: Local storage → move to cloud storage later

### Database Considerations
- **Development**: MongoDB Atlas free tier
- **Production**: Dedicated cluster with proper indexing
- **Seed Data**: Use `npm run seed` to populate initial products