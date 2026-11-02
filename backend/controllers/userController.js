const User = require('../models/User');
const Skill = require('../models/Skill');
const Feedback = require('../models/Feedback');

// @desc    Get all students for exploration with search & filters
// @route   GET /api/users
// @access  Public / Authenticated
exports.getUsers = async (req, res) => {
  try {
    const { search, category, teachSkill, learnSkill } = req.query;
    const currentUserId = req.user ? req.user._id : null;

    // Filter base: only active students
    let userQuery = { role: 'student', isActive: true };

    if (currentUserId) {
      userQuery._id = { $ne: currentUserId };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      userQuery.$or = [
        { name: searchRegex },
        { college: searchRegex },
        { department: searchRegex },
      ];
    }

    // Find users
    let users = await User.find(userQuery).select('-password').sort({ createdAt: -1 });

    // Fetch all skills for these users
    const userIds = users.map((u) => u._id);
    const allSkills = await Skill.find({ userId: { $in: userIds } });

    // Fetch all feedbacks to compute ratings
    const allFeedback = await Feedback.find({ receiverId: { $in: userIds } });

    // Build enriched student cards
    let studentCards = users.map((u) => {
      const userTeachSkills = allSkills.filter(
        (s) => s.userId.toString() === u._id.toString() && s.type === 'teach'
      );
      const userLearnSkills = allSkills.filter(
        (s) => s.userId.toString() === u._id.toString() && s.type === 'learn'
      );

      const userReviews = allFeedback.filter(
        (f) => f.receiverId.toString() === u._id.toString()
      );
      const avgRating =
        userReviews.length > 0
          ? Number((userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1))
          : 0;

      return {
        _id: u._id,
        id: u._id,
        name: u.name,
        email: u.email,
        college: u.college,
        department: u.department,
        year: u.year,
        bio: u.bio,
        profileImage: u.profileImage,
        createdAt: u.createdAt,
        teachSkills: userTeachSkills,
        learnSkills: userLearnSkills,
        rating: avgRating,
        reviewCount: userReviews.length,
      };
    });

    // Apply skill-specific filters if provided
    if (category && category !== 'All') {
      studentCards = studentCards.filter((student) =>
        student.teachSkills.some((s) => s.category.toLowerCase() === category.toLowerCase()) ||
        student.learnSkills.some((s) => s.category.toLowerCase() === category.toLowerCase())
      );
    }

    if (teachSkill && teachSkill.trim()) {
      const term = teachSkill.toLowerCase().trim();
      studentCards = studentCards.filter((student) =>
        student.teachSkills.some((s) => s.skillName.toLowerCase().includes(term))
      );
    }

    if (learnSkill && learnSkill.trim()) {
      const term = learnSkill.toLowerCase().trim();
      studentCards = studentCards.filter((student) =>
        student.learnSkills.some((s) => s.skillName.toLowerCase().includes(term))
      );
    }

    res.status(200).json({
      success: true,
      count: studentCards.length,
      users: studentCards,
    });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch students',
    });
  }
};

// @desc    Get user profile by ID with skills and reviews
// @route   GET /api/users/:id
// @access  Public / Authenticated
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const teachSkills = await Skill.find({ userId: user._id, type: 'teach' });
    const learnSkills = await Skill.find({ userId: user._id, type: 'learn' });

    const feedbacks = await Feedback.find({ receiverId: user._id })
      .populate('reviewerId', 'name profileImage college department')
      .sort({ createdAt: -1 });

    const avgRating =
      feedbacks.length > 0
        ? Number((feedbacks.reduce((sum, r) => sum + r.rating, 0) / feedbacks.length).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
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
        teachSkills,
        learnSkills,
        feedbacks,
        rating: avgRating,
        reviewCount: feedbacks.length,
      },
    });
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student details',
    });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, college, department, year, bio, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name.trim();
    if (college) user.college = college.trim();
    if (department) user.department = department.trim();
    if (year) user.year = year;
    if (bio !== undefined) user.bio = bio.trim();
    if (profileImage) user.profileImage = profileImage;

    await user.save();

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
      },
      message: 'Profile updated successfully!',
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};
