# DL Foods Admin Dashboard - Production Deployment Guide

## Environment Configuration

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Update Production Environment Variables
Edit `.env` file with your production values:

```env
# Production API URL (update this!)
VITE_API_BASE_URL=https://your-production-domain.com

# Admin Credentials (change these!)
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_PASSWORD=your_secure_password

# Admin Secret Key (must match backend)
VITE_ADMIN_SECRET_KEY="your-production-admin-secret-key"
```

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy
The `dist/` folder contains the built application ready for deployment.

## Production Features
- ✅ No hardcoded development URLs
- ✅ Environment-based configuration  
- ✅ Removed debug console logs
- ✅ Production error handling
- ✅ Consistent spacing across all sections
- ✅ DL Foods branding (logo & title)

## Vercel Deployment

### 1. Set Environment Variables in Vercel
In your Vercel dashboard, add these environment variables:

```
VITE_API_BASE_URL = https://your-backend-domain.com
VITE_ADMIN_USERNAME = your_admin_username
VITE_ADMIN_PASSWORD = your_secure_password
VITE_ADMIN_SECRET_KEY = "your-production-admin-secret-key"
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

The `vercel.json` file is already configured for:
- ✅ Single Page Application (SPA) routing
- ✅ Static asset caching
- ✅ Environment variable injection
- ✅ Vite framework optimization

## Security Notes
- Always use strong, unique admin credentials
- Generate a secure random admin secret key
- Use HTTPS in production
- Keep environment files secure and out of version control
- Set environment variables in Vercel dashboard (never commit them)