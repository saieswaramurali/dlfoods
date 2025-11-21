import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  authProvider: {
    type: String,
    default: 'google',
    enum: ['google']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    }
  },
  addresses: [{
    isDefault: {
      type: Boolean,
      default: false
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  }],
  joinedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    profileImage: this.profileImage,
    authProvider: this.authProvider,
    joinedDate: this.joinedDate
  };
});

// Method to get default address
userSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
};

// Method to add address
userSchema.methods.addAddress = function(addressData) {
  if (addressData.isDefault) {
    // Remove default from other addresses
    this.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  // If no addresses exist, make this the default
  if (this.addresses.length === 0) {
    addressData.isDefault = true;
  }
  
  this.addresses.push(addressData);
  return this.save();
};

export default mongoose.model('User', userSchema);