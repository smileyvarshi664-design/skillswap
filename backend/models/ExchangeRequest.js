const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema(
  {
    senderId: {
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
    offeredSkill: {
      type: String,
      required: [true, 'Please provide the skill you offer to teach'],
      trim: true,
    },
    requestedSkill: {
      type: String,
      required: [true, 'Please provide the skill you wish to learn'],
      trim: true,
    },
    message: {
      type: String,
      default: 'Hi! I would love to exchange skills with you on SkillSwap.',
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'],
      default: 'Pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active pending requests between same sender and receiver for the same skills
exchangeRequestSchema.index(
  { senderId: 1, receiverId: 1, offeredSkill: 1, requestedSkill: 1, status: 1 },
  { unique: false }
);

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
