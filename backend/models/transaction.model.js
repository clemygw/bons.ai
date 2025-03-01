const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'dining',
        'grocery',
        'transportation',
        'retail',
        'other'
      ],
      message: '{VALUE} is not a supported category'
    }
  },
  items: [{
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1']
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  merchant: {
    type: String,
    required: [true, 'Merchant name is required'],
    trim: true
  },
  receiptUploaded: {
    type: Boolean,
    default: false
  },
  co2Emissions: {
    type: Number,
    default: 0 // This will store the estimated emissions for this transaction
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ category: 1 });

// Add this middleware to automatically remove the transaction from user's array when deleted
transactionSchema.pre('findOneAndDelete', async function(next) {
  const transaction = await this.model.findOne(this.getQuery());
  if (transaction) {
    await mongoose.model('User').updateOne(
      { _id: transaction.user },
      { $pull: { transactions: transaction._id } }
    );
  }
  next();
});

// Also handle regular delete
transactionSchema.pre('deleteMany', async function(next) {
  const transactions = await this.model.find(this.getQuery());
  const transactionIds = transactions.map(t => t._id);
  const userIds = [...new Set(transactions.map(t => t.user))];
  
  await mongoose.model('User').updateMany(
    { _id: { $in: userIds } },
    { $pull: { transactions: { $in: transactionIds } } }
  );
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 