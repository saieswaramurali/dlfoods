import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
  }

  // Initialize the email service lazily
  initialize() {
    if (this.isInitialized) {
      return this.transporter !== null;
    }

    // Debug: Log what we're getting from environment variables
    console.log('🔍 Debug - EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
    console.log('🔍 Debug - EMAIL_APP_PASSWORD:', process.env.EMAIL_APP_PASSWORD ? 'SET' : 'NOT SET');
    
    // Check if email credentials are provided
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.log('❌ Email credentials not found in environment variables');
      console.log('📧 Email notifications will be disabled');
      this.transporter = null;
      this.isInitialized = true;
      return false;
    }

    // Create transporter for Gmail with explicit configuration
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_APP_PASSWORD // Your Gmail App Password (not regular password)
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    this.isInitialized = true;
    
    // Verify connection on startup
    this.verifyConnection();
    return true;
  }

  async verifyConnection() {
    if (!this.initialize() || !this.transporter) {
      return;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      console.log(`📧 Using email: ${process.env.EMAIL_USER}`);
    } catch (error) {
      console.log('❌ Email service connection failed:', error.message);
      console.log('📧 Email notifications will be disabled');
      console.log('💡 Check your Gmail App Password and 2FA settings');
    }
  }

  async sendWelcomeEmail(user) {
    if (!this.initialize() || !this.transporter) {
      console.log('📧 Email service not configured, skipping welcome email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: {
          name: 'DL Foods',
          address: process.env.EMAIL_USER
        },
        to: user.email,
        subject: '🎉 Welcome to DL Foods - Your Nutrition Journey Starts Here!',
        html: this.getWelcomeEmailTemplate(user)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  getWelcomeEmailTemplate(user) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to DL Foods</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #d97706;
            margin-bottom: 10px;
          }
          .welcome-text {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .highlight {
            background-color: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .benefits {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
          }
          .benefit-item {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #4b5563;
          }
          .benefit-icon {
            color: #10b981;
            margin-right: 8px;
            font-weight: bold;
          }
          .cta-button {
            display: inline-block;
            background-color: #d97706;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌿 DL Foods</div>
            <h1 class="welcome-text">Welcome, ${user.name}! 🎉</h1>
          </div>

          <div class="content">
            <p>Hello ${user.name}!</p>
            
            <p>Welcome to DL Foods! 🌿</p>
            
            <p>We're excited to have you join us. Thank you for signing in and taking the first step towards exploring our range of premium nutrition products.</p>

            <div class="highlight">
              <h3>Ready to explore? 🛒</h3>
              <p>Discover our carefully curated selection of health and wellness products designed to support your nutrition goals.</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/products" class="cta-button">
                🛍️ Explore Our Products
              </a>
            </div>

            <p>Happy shopping!</p>
          </div>

          <div class="footer">
            <p>Thank you for joining DL Foods!</p>
            <p>
              <strong>DL Foods Team</strong><br>
              🌐 Website: <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}">DL Foods</a>
            </p>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendOrderConfirmationEmail(user, order) {
    if (!this.initialize() || !this.transporter) {
      console.log('📧 Email service not configured, skipping order confirmation email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const mailOptions = {
        from: {
          name: 'DL Foods',
          address: process.env.EMAIL_USER
        },
        to: user.email,
        subject: `✅ Order Confirmed - #${order.orderId}`,
        html: this.getOrderConfirmationTemplate(user, order)
      };

      // Add timeout to email sending (60 seconds max)
      const emailPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 60 seconds')), 60000)
      );

      const info = await Promise.race([emailPromise, timeoutPromise]);
      console.log('✅ Order confirmation email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  getOrderConfirmationTemplate(user, order) {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .order-table th {
            background-color: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          .total-row {
            background-color: #fef3c7;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
            <p>Thank you for your order, ${user.name}!</p>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
          </div>

          <table class="order-table">
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td colspan="2" style="padding: 15px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 15px; text-align: right;"><strong>₹${order.pricing.total}</strong></td>
              </tr>
            </tbody>
          </table>

          <p>We'll send you another email once your order ships with tracking information.</p>
          <p>Questions? Reply to this email or visit our support center.</p>

          <p>Thank you for choosing DL Foods!</p>
        </div>
      </body>
      </html>
    `;
  }

  // Send contact form email
  async sendContactEmail({ name, email, subject, message, contactId }) {
    if (!this.initialize() || !this.transporter) {
      console.log('⚠️  Email service not available for contact form');
      return;
    }

    try {
      const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Sender name from form
        to: process.env.EMAIL_USER, // Your business email
        replyTo: email, // Customer's email for easy replies
        subject: `Contact Form: ${subject}`,
        html: this.generateContactEmailTemplate({ name, email, subject, message, contactId }),
        text: `
Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `.trim()
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Contact email sent successfully:', info.messageId);

      // Send auto-reply to customer
      await this.sendContactAutoReply({ name, email, subject });
      
    } catch (error) {
      console.error('❌ Failed to send contact email:', error);
      throw error;
    }
  }

  // Send auto-reply to customer
  async sendContactAutoReply({ name, email, subject }) {
    try {
      const mailOptions = {
        from: `"DL Foods Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `We received your message: ${subject}`,
        html: this.generateContactAutoReplyTemplate({ name }),
        text: `
Hi ${name},

Thank you for contacting DL Foods! We have received your message and will get back to you within 24 hours.

If your inquiry is urgent, please call us at +91 98765 43210 during business hours (Mon-Sat, 9:00 AM - 7:00 PM).

Best regards,
DL Foods Support Team
        `.trim()
      };

      await this.transporter.sendMail(mailOptions);
      console.log('📧 Contact auto-reply sent successfully');
    } catch (error) {
      console.error('❌ Failed to send contact auto-reply:', error);
      // Don't throw error here as it's not critical
    }
  }

  // Generate HTML template for contact form email
  generateContactEmailTemplate({ name, email, subject, message, contactId }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .info-table td { padding: 10px; border-bottom: 1px solid #ddd; }
          .label { font-weight: bold; background: #f0f0f0; width: 120px; }
          .message-box { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f59e0b; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
        </div>
        
        <div class="content">
          <table class="info-table">
            <tr>
              <td class="label">Name:</td>
              <td>${name}</td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td>${email}</td>
            </tr>
            <tr>
              <td class="label">Subject:</td>
              <td>${subject}</td>
            </tr>
            <tr>
              <td class="label">Submitted:</td>
              <td>${new Date().toLocaleString()}</td>
            </tr>
            ${contactId ? `
            <tr>
              <td class="label">Reference:</td>
              <td>DLF-${contactId.toString().slice(-8).toUpperCase()}</td>
            </tr>
            ` : ''}
          </table>
          
          <div class="message-box">
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p><strong>Reply directly to this email to respond to the customer.</strong></p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate HTML template for contact auto-reply
  generateContactAutoReplyTemplate({ name }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✉️ Message Received!</h1>
        </div>
        
        <div class="content">
          <p>Hi ${name},</p>
          
          <p>Thank you for contacting DL Foods! We have received your message and will get back to you within <strong>24 hours</strong>.</p>
          
          <div class="highlight">
            <p><strong>Need immediate assistance?</strong><br>
            📞 Call us at: +91 98765 43210<br>
            🕒 Business Hours: Mon-Sat, 9:00 AM - 7:00 PM</p>
          </div>
          
          <p>In the meantime, you might find answers to common questions in our <a href="http://localhost:5173/support/faq" style="color: #f59e0b;">FAQ section</a>.</p>
          
          <p>Best regards,<br>
          <strong>DL Foods Support Team</strong></p>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();