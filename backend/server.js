import app from './src/app.js';

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
🚀 DL Foods Backend Server Started Successfully!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Port: ${PORT}
🔗 Local: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api/docs
🏥 Health Check: http://localhost:${PORT}/health

🔐 Google OAuth:
   - Login: http://localhost:${PORT}/api/auth/google
   - Callback: http://localhost:${PORT}/api/auth/google/callback

📋 Available Endpoints:
   - Authentication: /api/auth/*
   - Users: /api/users/*
   - Products: /api/products/*
   - Orders: /api/orders/*
   - Cart: /api/cart/*

⚙️  Configuration Required:
   1. Set up MongoDB Atlas connection string in .env
   2. Configure Google OAuth credentials in .env
   3. Set up Cloudinary for image uploads in .env
  `);
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ ${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n📴 Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('✅ Server closed successfully');
    console.log('👋 Goodbye!');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forcefully shutting down after 10 seconds');
    process.exit(1);
  }, 10000);
};

// Listen for shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

export default server;