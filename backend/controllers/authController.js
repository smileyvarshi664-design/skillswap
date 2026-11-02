const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Skill = require('../models/Skill');
const Feedback = require('../models/Feedback');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillswap_super_secret_jwt_key_2026_mfef', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, college, department, year, bio, profileImage } = req.body;

    // Validate required fields
    if (!name || !email || !password || !college || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, college, department, year',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and Confirm Password do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      college,
      department,
      year,
      bio: bio || 'Passionate student eager to exchange knowledge, build cool projects, and learn new skills!',
      profileImage: profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      role: 'student',
      isActive: true,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        bio: user.bio,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      message: 'Account created successfully! Welcome to SkillSwap.',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login student or admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        bio: user.bio,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      message: 'Login successful! Welcome back.',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Fetch user's skills count and feedback
    const teachCount = await Skill.countDocuments({ userId: user._id, type: 'teach' });
    const learnCount = await Skill.countDocuments({ userId: user._id, type: 'learn' });

    const feedbackList = await Feedback.find({ receiverId: user._id });
    const avgRating =
      feedbackList.length > 0
        ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        department: user.department,
        year: user.year,
        bio: user.bio,
        profileImage: user.profileImage,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        teachCount,
        learnCount,
        rating: Number(avgRating),
        reviewCount: feedbackList.length,
      },
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user profile',
    });
  }
};
