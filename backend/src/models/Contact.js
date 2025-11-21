import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  subject: {
    type: String,
    trim: true,
    maxLength: [200, 'Subject cannot exceed 200 characters'],
    enum: {
      values: ['general', 'product', 'order', 'shipping', 'return', 'wholesale', 'feedback', 'other'],
      message: 'Please select a valid subject category'
    }
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxLength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'resolved'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxLength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ priority: 1, status: 1 });

// Virtual for formatted date
contactSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for time since submission
contactSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
});

// Static method to get contact statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        read: { $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] } },
        responded: { $sum: { $cond: [{ $eq: ['$status', 'responded'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    new: 0,
    read: 0,
    responded: 0,
    resolved: 0
  };
};

// Static method to get recent contacts
contactSchema.statics.getRecent = function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name email subject status priority createdAt');
};

// Method to mark as read
contactSchema.methods.markAsRead = function() {
  if (this.status === 'new') {
    this.status = 'read';
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to mark as responded
contactSchema.methods.markAsResponded = function(respondedBy) {
  this.status = 'responded';
  this.respondedAt = new Date();
  if (respondedBy) {
    this.respondedBy = respondedBy;
  }
  return this.save();
};

export default mongoose.model('Contact', contactSchema);