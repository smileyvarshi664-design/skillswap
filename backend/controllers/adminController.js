const User = require('../models/User');
const Skill = require('../models/Skill');
const ExchangeRequest = require('../models/ExchangeRequest');
const Exchange = require('../models/Exchange');
const Feedback = require('../models/Feedback');

// @desc    Get admin dashboard metrics and statistics
// @route   GET /api/admin/dashboard
// @access  Private / Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeUsers = await User.countDocuments({ role: 'student', isActive: true });
    const inactiveUsers = await User.countDocuments({ role: 'student', isActive: false });

    const totalSkills = await Skill.countDocuments();
    const teachSkillsCount = await Skill.countDocuments({ type: 'teach' });
    const learnSkillsCount = await Skill.countDocuments({ type: 'learn' });

    const totalRequests = await ExchangeRequest.countDocuments();
    const pendingRequests = await ExchangeRequest.countDocuments({ status: 'Pending' });
    const acceptedRequests = await ExchangeRequest.countDocuments({ status: 'Accepted' });

    const totalExchanges = await Exchange.countDocuments();
    const inProgressExchanges = await Exchange.countDocuments({ status: 'In Progress' });
    const completedExchanges = await Exchange.countDocuments({ status: 'Completed' });

    const totalFeedback = await Feedback.countDocuments();

    // Category breakdown
    const skillsByCategory = await Skill.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent user signups
    const recentStudents = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent exchanges
    const recentExchanges = await Exchange.find()
      .populate('studentOne', 'name email college')
      .populate('studentTwo', 'name email college')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalSkills,
        teachSkillsCount,
        learnSkillsCount,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        totalExchanges,
        inProgressExchanges,
        completedExchanges,
        totalFeedback,
        skillsByCategory,
      },
      recentStudents,
      recentExchanges,
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin stats',
    });
  }
};

// @desc    Get all registered users for admin management
// @route   GET /api/admin/users
// @access  Private / Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);
    const skills = await Skill.find({ userId: { $in: userIds } });

    const enrichedUsers = users.map((u) => {
      const teachCount = skills.filter(
        (s) => s.userId.toString() === u._id.toString() && s.type === 'teach'
      ).length;
      const learnCount = skills.filter(
        (s) => s.userId.toString() === u._id.toString() && s.type === 'learn'
      ).length;

      return {
        ...u.toObject(),
        teachCount,
        learnCount,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      users: enrichedUsers,
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
};

// @desc    Toggle or update user active status (deactivate/activate)
// @route   PUT /api/admin/users/:id/status
// @access  Private / Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot toggle status of admin account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
      message: `User ${user.name} has been ${user.isActive ? 'activated' : 'deactivated'} successfully!`,
    });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user status',
    });
  }
};

// @desc    Get all exchange requests for admin audit
// @route   GET /api/admin/requests
// @access  Private / Admin
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find()
      .populate('senderId', 'name email college department')
      .populate('receiverId', 'name email college department')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('getAllRequests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch platform requests',
    });
  }
};
