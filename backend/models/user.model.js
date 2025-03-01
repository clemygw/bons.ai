const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long']
  },
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  company_id: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create a compound index for efficient querying
userSchema.index({ email: 1, user_id: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User; 