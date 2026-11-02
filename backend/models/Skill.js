const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    skillName: {
      type: String,
      required: [true, 'Please provide skill name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Programming',
        'Web Development',
        'Designing',
        'Communication',
        'Photography',
        'Video Editing',
        'Marketing',
        'Data Science',
        'Languages',
        'Other',
      ],
      default: 'Programming',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      required: [true, 'Please specify skill type (teach or learn)'],
      enum: ['teach', 'learn'],
      index: true,
    },
    proficiencyLevel: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique skill per user per type to avoid duplicates
skillSchema.index({ userId: 1, skillName: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
