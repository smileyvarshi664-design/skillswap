const ExchangeRequest = require('../models/ExchangeRequest');
const Exchange = require('../models/Exchange');
const Skill = require('../models/Skill');
const User = require('../models/User');

// Helper to normalize skill string for comparison
const normalize = (str) => (str ? str.toLowerCase().trim() : '');

// @desc    Get smart skill matches for current logged in student
// @route   GET /api/matches
// @access  Private
exports.getMatches = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Get current student's skills
    const mySkills = await Skill.find({ userId: currentUserId });
    const myTeachSkills = mySkills.filter((s) => s.type === 'teach');
    const myLearnSkills = mySkills.filter((s) => s.type === 'learn');

    if (myTeachSkills.length === 0 && myLearnSkills.length === 0) {
      return res.status(200).json({
        success: true,
        matches: [],
        message: 'Add skills you can teach and skills you want to learn to see smart matches!',
      });
    }

    // Get all other active students
    const otherUsers = await User.find({
      _id: { $ne: currentUserId },
      role: 'student',
      isActive: true,
    }).select('-password');

    const otherUserIds = otherUsers.map((u) => u._id);
    const allOtherSkills = await Skill.find({ userId: { $in: otherUserIds } });

    const matches = [];

    for (const otherUser of otherUsers) {
      const otherTeachSkills = allOtherSkills.filter(
        (s) => s.userId.toString() === otherUser._id.toString() && s.type === 'teach'
      );
      const otherLearnSkills = allOtherSkills.filter(
        (s) => s.userId.toString() === otherUser._id.toString() && s.type === 'learn'
      );

      // What other student teaches that current user wants to learn
      const theyTeachIWant = otherTeachSkills.filter((otherTeach) =>
        myLearnSkills.some(
          (myLearn) =>
            normalize(myLearn.skillName) === normalize(otherTeach.skillName) ||
            normalize(myLearn.skillName).includes(normalize(otherTeach.skillName)) ||
            normalize(otherTeach.skillName).includes(normalize(myLearn.skillName))
        )
      );

      // What current user teaches that other student wants to learn
      const iTeachTheyWant = myTeachSkills.filter((myTeach) =>
        otherLearnSkills.some(
          (otherLearn) =>
            normalize(otherLearn.skillName) === normalize(myTeach.skillName) ||
            normalize(otherLearn.skillName).includes(normalize(myTeach.skillName)) ||
            normalize(myTeach.skillName).includes(normalize(otherLearn.skillName))
        )
      );

      const isMutual = theyTeachIWant.length > 0 && iTeachTheyWant.length > 0;
      const isOneWay = theyTeachIWant.length > 0 || iTeachTheyWant.length > 0;

      if (isMutual || isOneWay) {
        let score = 0;
        let matchType = 'Partial Match';

        if (isMutual) {
          matchType = 'Mutual Match';
          score = 90 + Math.min(theyTeachIWant.length + iTeachTheyWant.length, 10);
        } else if (theyTeachIWant.length > 0) {
          matchType = 'They Teach What You Want';
          score = 65 + Math.min(theyTeachIWant.length * 5, 20);
        } else {
          matchType = 'You Teach What They Want';
          score = 55 + Math.min(iTeachTheyWant.length * 5, 20);
        }

        matches.push({
          user: otherUser,
          matchType,
          score,
          isMutual,
          theyTeachIWant,
          iTeachTheyWant,
          otherTeachSkills,
          otherLearnSkills,
        });
      }
    }

    // Sort matches: Mutual first, then highest score
    matches.sort((a, b) => {
      if (a.isMutual && !b.isMutual) return -1;
      if (!a.isMutual && b.isMutual) return 1;
      return b.score - a.score;
    });

    res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error('getMatches error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate matches',
    });
  }
};

// @desc    Send an exchange request
// @route   POST /api/requests
// @access  Private
exports.sendRequest = async (req, res) => {
  try {
    const { receiverId, offeredSkill, requestedSkill, message } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !offeredSkill || !requestedSkill) {
      return res.status(400).json({
        success: false,
        message: 'Please provide receiverId, offeredSkill, and requestedSkill',
      });
    }

    // Cannot send request to oneself
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send an exchange request to yourself',
      });
    }

    // Check if receiver exists and is active
    const receiver = await User.findById(receiverId);
    if (!receiver || !receiver.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Target student not found or is currently inactive',
      });
    }

    // Check for existing pending request between these two students
    const existingPending = await ExchangeRequest.findOne({
      $or: [
        { senderId, receiverId, status: 'Pending' },
        { senderId: receiverId, receiverId: senderId, status: 'Pending' },
      ],
    });

    if (existingPending) {
      return res.status(400).json({
        success: false,
        message:
          'A pending exchange request already exists between you and this student. Please check your Requests tab.',
      });
    }

    const newRequest = await ExchangeRequest.create({
      senderId,
      receiverId,
      offeredSkill: offeredSkill.trim(),
      requestedSkill: requestedSkill.trim(),
      message: message ? message.trim() : 'Hi! I would love to exchange skills with you on SkillSwap.',
      status: 'Pending',
    });

    const populatedRequest = await ExchangeRequest.findById(newRequest._id)
      .populate('senderId', 'name email college department profileImage')
      .populate('receiverId', 'name email college department profileImage');

    res.status(201).json({
      success: true,
      request: populatedRequest,
      message: `Exchange request sent successfully to ${receiver.name}!`,
    });
  } catch (error) {
    console.error('sendRequest error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send exchange request',
    });
  }
};

// @desc    Get received exchange requests
// @route   GET /api/requests/received
// @access  Private
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({ receiverId: req.user._id })
      .populate('senderId', 'name email college department year bio profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('getReceivedRequests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch received requests',
    });
  }
};

// @desc    Get sent exchange requests
// @route   GET /api/requests/sent
// @access  Private
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await ExchangeRequest.find({ senderId: req.user._id })
      .populate('receiverId', 'name email college department year bio profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('getSentRequests error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch sent requests',
    });
  }
};

// @desc    Accept exchange request
// @route   PUT /api/requests/:id/accept
// @access  Private
exports.acceptRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found',
      });
    }

    // Only receiver can accept
    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to accept this request',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This request cannot be accepted because it is already ${request.status}`,
      });
    }

    request.status = 'Accepted';
    await request.save();

    // Create Exchange
    const exchange = await Exchange.create({
      requestId: request._id,
      studentOne: request.senderId,
      studentTwo: request.receiverId,
      skillOne: request.offeredSkill,
      skillTwo: request.requestedSkill,
      status: 'In Progress',
    });

    const populatedExchange = await Exchange.findById(exchange._id)
      .populate('studentOne', 'name email college department profileImage')
      .populate('studentTwo', 'name email college department profileImage');

    res.status(200).json({
      success: true,
      request,
      exchange: populatedExchange,
      message: 'Exchange request accepted! Your skill exchange is now active.',
    });
  } catch (error) {
    console.error('acceptRequest error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept exchange request',
    });
  }
};

// @desc    Reject exchange request
// @route   PUT /api/requests/:id/reject
// @access  Private
exports.rejectRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found',
      });
    }

    // Only receiver can reject
    if (request.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reject this request',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `This request is already ${request.status}`,
      });
    }

    request.status = 'Rejected';
    await request.save();

    res.status(200).json({
      success: true,
      request,
      message: 'Exchange request has been rejected',
    });
  } catch (error) {
    console.error('rejectRequest error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject exchange request',
    });
  }
};

// @desc    Cancel a sent pending request
// @route   PUT /api/requests/:id/cancel
// @access  Private
exports.cancelRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Exchange request not found',
      });
    }

    // Only sender can cancel
    if (request.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this request',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a request that is already ${request.status}`,
      });
    }

    request.status = 'Cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      request,
      message: 'Exchange request cancelled successfully',
    });
  } catch (error) {
    console.error('cancelRequest error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel exchange request',
    });
  }
};
