const mongoose = require('mongoose');
const { Schema } = mongoose;

const companySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    unique: true,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  totalEmissions: {
    type: Number,
    default: 0 // Sum of all users' emissions
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
module.exports = Company;