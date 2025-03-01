const mongoose = require('mongoose');
const { Schema } = mongoose;

const emissionsSchema = new Schema({
  transaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  co2Emissions: {
    type: Number,
    required: true,
    min: [0, 'CO₂ emissions cannot be negative']
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Emission = mongoose.model('Emission', emissionsSchema);
module.exports = Emission;