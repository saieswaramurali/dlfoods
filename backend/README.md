# DL Foods Backend API

A comprehensive Node.js backend API for the DL Foods nutrition masala e-commerce platform with Google OAuth authentication, product management, order processing, and cart functionality.

## 🚀 Features

- **Google OAuth 2.0 Authentication** - Secure, passwordless login
- **Product Management** - Complete CRUD operations for products
- **Order Management** - Order creation, tracking, and cancellation
- **Shopping Cart** - Persistent cart functionality
- **User Profiles** - User management with addresses
- **Image Upload** - Cloudinary integration for product images
- **Real-time Inventory** - Stock management and tracking
- **Review System** - Product reviews and ratings
- **Rate Limiting** - API protection and security
- **Input Validation** - Comprehensive data validation

## 🛠️ Technology Stack

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Google OAuth 2.0 + JWT
- **File Storage**: Cloudinary
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: Nodemon, Morgan logging

## 📦 Installation

1. **Clone the repository**
```bash
cd /path/to/dlfoods/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
   - Copy `.env` file and update with your credentials:
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/dlfoods

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173

# Session Secret
SESSION_SECRET=your_session_secret
```

4. **Database Setup**
   - Create MongoDB Atlas cluster
   - Update connection string in `.env`
   - Run seed script to populate products:
```bash
npm run seed
```

5. **Google OAuth Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized origins: `http://localhost:5000`
   - Add authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
   - Copy Client ID and Secret to `.env`

6. **Cloudinary Setup** (Optional for image uploads)
   - Create account at [Cloudinary](https://cloudinary.com/)
   - Get cloud name, API key, and secret
   - Update `.env` file

## 🎯 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

## 📚 API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/addresses` - Get addresses
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `GET /api/users/orders` - Get user orders

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/categories` - Get categories
- `GET /api/products/search?q=term` - Search products
- `GET /api/products/:slug` - Get product by slug
- `GET /api/products/:id/reviews` - Get product reviews

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get specific order
- `PUT /api/orders/:orderId/cancel` - Cancel order
- `GET /api/orders/:orderId/track` - Track order

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update item quantity
- `DELETE /api/cart/items/:productId` - Remove item
- `DELETE /api/cart` - Clear cart

## 🔐 Authentication Flow

1. **Frontend** redirects to `/api/auth/google`
2. **User** authenticates with Google
3. **Backend** receives user data and creates/updates user
4. **Backend** generates JWT token
5. **Backend** redirects to frontend with token
6. **Frontend** stores token and makes authenticated requests

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ✅ |
| `CLIENT_URL` | Frontend URL for CORS | ✅ |
| `SESSION_SECRET` | Express session secret | ✅ |
| `CLOUDINARY_*` | Cloudinary credentials | ⚠️ Optional |
| `PORT` | Server port | ⚠️ Optional (default: 5000) |

## 🛡️ Security Features

- **Rate Limiting** - Prevents API abuse
- **CORS** - Controlled cross-origin requests
- **Helmet** - Security headers
- **Input Validation** - Joi schema validation
- **JWT Authentication** - Stateless authentication
- **Password-less** - Google OAuth only
- **Data Sanitization** - Prevents injection attacks

## 📊 Database Schema

### User
```javascript
{
  googleId: String,
  email: String,
  name: String,
  profileImage: String,
  phone: String,
  addresses: [AddressSchema],
  preferences: Object,
  joinedDate: Date
}
```

### Product
```javascript
{
  name: String,
  slug: String,
  description: String,
  price: Number,
  images: [ImageSchema],
  category: String,
  inventory: Object,
  ratings: Object
}
```

### Order
```javascript
{
  orderId: String,
  userId: ObjectId,
  items: [OrderItemSchema],
  pricing: Object,
  status: String,
  shippingAddress: Object,
  paymentDetails: Object,
  tracking: Object
}
```

## 🚨 Error Handling

The API uses consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [/* Validation errors */]
}
```

## 📈 Performance

- **MongoDB Indexing** - Optimized queries
- **Compression** - Gzip response compression
- **Caching Headers** - Browser caching
- **Pagination** - Large dataset handling
- **Lean Queries** - Faster JSON responses

## 🔄 Development Workflow

1. **Make changes** to source code
2. **Nodemon** automatically restarts server
3. **Test endpoints** using Postman/Thunder Client
4. **Check logs** in terminal
5. **Commit changes** when ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Create Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review API endpoints and examples

## 🎉 Next Steps

After setting up the backend:

1. **Configure MongoDB Atlas** with your connection string
2. **Set up Google OAuth** credentials
3. **Run seed script** to populate products
4. **Test authentication** flow
5. **Connect frontend** to backend APIs
6. **Add payment gateway** integration (Razorpay)
7. **Implement admin panel** for product management
8. **Add email notifications** for orders
9. **Set up deployment** (Railway, Heroku, etc.)
10. **Configure production** environment variables