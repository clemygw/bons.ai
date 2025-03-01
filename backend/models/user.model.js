const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  transactions: {
    type: [Schema.Types.ObjectId],
    ref: 'Transaction',
    required: false
  },
  totalEmissions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// When a new user is created or updated
userSchema.post('save', async function(doc) {
  if (doc.company) {
    await mongoose.model('Company').findByIdAndUpdate(
      doc.company,
      { $addToSet: { users: doc._id } }, // $addToSet prevents duplicates
      { new: true }
    );
  }
});

// Before a user is deleted
userSchema.pre('findOneAndDelete', async function() {
  const user = await this.model.findOne(this.getQuery());
  if (user && user.company) {
    await mongoose.model('Company').findByIdAndUpdate(
      user.company,
      { $pull: { users: user._id } }
    );
  }
});

// Handle bulk deletions
userSchema.pre('deleteMany', async function() {
  const users = await this.model.find(this.getQuery());
  const updates = users.map(user => {
    if (user.company) {
      return mongoose.model('Company').findByIdAndUpdate(
        user.company,
        { $pull: { users: user._id } }
      );
    }
  });
  await Promise.all(updates.filter(Boolean));
});

// When a user's company is updated
userSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate();
  const user = await this.model.findOne(this.getQuery());

  // If company is being changed
  if (update.$set?.company !== undefined && user) {
    // Remove user from old company
    if (user.company) {
      await mongoose.model('Company').findByIdAndUpdate(
        user.company,
        { $pull: { users: user._id } }
      );
    }
    
    // Add user to new company
    if (update.$set.company) {
      await mongoose.model('Company').findByIdAndUpdate(
        update.$set.company,
        { $addToSet: { users: user._id } }
      );
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User; 