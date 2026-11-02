const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    college: {
      type: String,
      required: [true, 'Please specify your college'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please specify your department'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Please specify your year of study'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Other'],
      default: '2nd Year',
    },
    bio: {
      type: String,
      default: 'Passionate student eager to exchange knowledge, build cool projects, and learn new skills!',
      maxlength: 500,
    },
    profileImage: {
      type: String,
      default: 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for average rating
userSchema.virtual('averageRating', {
  ref: 'Feedback',
  localField: '_id',
  foreignField: 'receiverId',
});

module.exports = mongoose.model('User', userSchema);
