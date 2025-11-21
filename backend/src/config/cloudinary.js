import multer from 'multer';
import path from 'path';

// Simple local file storage (for development)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploads in frontend assets directory
    const uploadPath = '/home/sai/Desktop/web/dlfoods/frontend/src/assets/uploads';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Configure multer for local storage
const upload = multer({
  storage: localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to generate image URL for frontend
const getImageUrl = (filename) => {
  return `/assets/uploads/${filename}`;
};

// Helper function to get existing product images
const getProductImageUrl = (imageName) => {
  return `/assets/product_images/${imageName}`;
};

export {
  upload,
  getImageUrl,
  getProductImageUrl
};