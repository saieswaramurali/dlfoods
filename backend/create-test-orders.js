// Script to add test orders to the database
import mongoose from 'mongoose';
import Order from '../src/models/Order.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check if test users and products exist, create if needed
    let testUser = await User.findOne({ email: 'test@dlfoods.com' });
    if (!testUser) {
      testUser = new User({
        name: 'Test Customer',
        email: 'test@dlfoods.com',
        phone: '+1234567890',
        isActive: true
      });
      await testUser.save();
      console.log('✅ Created test user');
    }
    
    let testUser2 = await User.findOne({ email: 'customer2@dlfoods.com' });
    if (!testUser2) {
      testUser2 = new User({
        name: 'Jane Smith',
        email: 'customer2@dlfoods.com', 
        phone: '+0987654321',
        isActive: true
      });
      await testUser2.save();
      console.log('✅ Created test user 2');
    }

    // Create test orders with different statuses
    const testOrders = [
      {
        orderId: `DL${Date.now()}001`,
        userId: testUser._id,
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: 'Organic Honey 500ml',
            price: 25.99,
            quantity: 2,
            image: '/images/honey.jpg'
          }
        ],
        pricing: {
          subtotal: 51.98,
          shipping: 5.00,
          tax: 2.60,
          total: 59.58
        },
        status: 'confirmed',
        shippingAddress: {
          fullName: 'Test Customer',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          pincode: '10001',
          phone: '+1234567890'
        },
        paymentMethod: 'card',
        paymentStatus: 'completed'
      },
      {
        orderId: `DL${Date.now()}002`,
        userId: testUser2._id,
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: 'Pure Ghee 1kg',
            price: 45.50,
            quantity: 1,
            image: '/images/ghee.jpg'
          }
        ],
        pricing: {
          subtotal: 45.50,
          shipping: 0.00,
          tax: 2.28,
          total: 47.78
        },
        status: 'preparing',
        shippingAddress: {
          fullName: 'Jane Smith',
          address: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA', 
          pincode: '90210',
          phone: '+0987654321'
        },
        paymentMethod: 'card',
        paymentStatus: 'completed'
      },
      {
        orderId: `DL${Date.now()}003`,
        userId: testUser._id,
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: 'Organic Rice 5kg',
            price: 35.00,
            quantity: 1,
            image: '/images/rice.jpg'
          }
        ],
        pricing: {
          subtotal: 35.00,
          shipping: 8.00,
          tax: 1.75,
          total: 44.75
        },
        status: 'shipped',
        shippingAddress: {
          fullName: 'Test Customer',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          pincode: '10001', 
          phone: '+1234567890'
        },
        paymentMethod: 'card',
        paymentStatus: 'completed'
      },
      {
        orderId: `DL${Date.now()}004`,
        userId: testUser2._id,
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            name: 'Turmeric Powder 200g',
            price: 12.99,
            quantity: 3,
            image: '/images/turmeric.jpg'
          }
        ],
        pricing: {
          subtotal: 38.97,
          shipping: 5.00,
          tax: 1.95,
          total: 45.92
        },
        status: 'delivered',
        shippingAddress: {
          fullName: 'Jane Smith',
          address: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          pincode: '90210',
          phone: '+0987654321'
        },
        paymentMethod: 'card',
        paymentStatus: 'completed'
      }
    ];

    // Clear existing test orders to avoid duplicates
    await Order.deleteMany({ orderId: { $regex: /^DL\d+00[1-4]$/ } });
    console.log('🗑️ Cleared existing test orders');

    // Insert new test orders
    const createdOrders = await Order.insertMany(testOrders);
    console.log(`✅ Created ${createdOrders.length} test orders`);
    
    // Show status summary
    const statusCounts = {};
    createdOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    console.log('\n📊 Test Orders Created:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} orders`);
    });
    
  } catch (error) {
    console.error('❌ Error creating test orders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

createTestOrders();