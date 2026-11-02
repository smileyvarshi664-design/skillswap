const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    exchangeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exchange',
      required: true,
      index: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a feedback review'],
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate feedback from the same reviewer for the same exchange
feedbackSchema.index({ exchangeId: 1, reviewerId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
