const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: true,
      unique: true,
    },
    studentOne: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentTwo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    skillOne: {
      type: String,
      required: true,
      trim: true,
    },
    skillTwo: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Cancelled'],
      default: 'In Progress',
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exchange', exchangeSchema);
