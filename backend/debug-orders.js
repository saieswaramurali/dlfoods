// Debug script to check orders in database
import mongoose from 'mongoose';
import Order from '../src/models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get all orders
    const allOrders = await Order.find().populate('userId', 'name email');
    console.log(`📊 Total orders in database: ${allOrders.length}`);
    
    if (allOrders.length > 0) {
      console.log('\n📋 Orders by status:');
      const statusCounts = {};
      
      allOrders.forEach(order => {
        const status = order.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
        
        console.log(`- Order ${order.orderId}: ${status} (${order.createdAt})`);
      });
      
      console.log('\n📈 Status Summary:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} orders`);
      });
      
      // Show sample order structure
      console.log('\n📄 Sample Order Structure:');
      console.log(JSON.stringify(allOrders[0], null, 2));
    } else {
      console.log('⚠️ No orders found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

checkOrders();