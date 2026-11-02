const Feedback = require('../models/Feedback');
const Exchange = require('../models/Exchange');
const User = require('../models/User');

// @desc    Submit feedback/rating for an exchange
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = async (req, res) => {
  try {
    const { exchangeId, receiverId, rating, comment } = req.body;
    const reviewerId = req.user._id;

    if (!exchangeId || !receiverId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide exchangeId, receiverId, rating, and feedback comment',
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5',
      });
    }

    if (!comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please write a brief feedback comment',
      });
    }

    // Verify exchange exists
    const exchange = await Exchange.findById(exchangeId);
    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Skill exchange not found',
      });
    }

    // Reviewer must be participant
    const isParticipant =
      exchange.studentOne.toString() === reviewerId.toString() ||
      exchange.studentTwo.toString() === reviewerId.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this exchange',
      });
    }

    // Cannot review oneself
    if (reviewerId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot review yourself',
      });
    }

    // Check duplicate feedback
    const existing = await Feedback.findOne({
      exchangeId,
      reviewerId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this skill exchange',
      });
    }

    const feedback = await Feedback.create({
      exchangeId,
      reviewerId,
      receiverId,
      rating: numRating,
      comment: comment.trim(),
    });

    const populatedFeedback = await Feedback.findById(feedback._id).populate(
      'reviewerId',
      'name college department profileImage'
    );

    res.status(201).json({
      success: true,
      feedback: populatedFeedback,
      message: 'Thank you! Your feedback has been recorded successfully.',
    });
  } catch (error) {
    console.error('createFeedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit feedback',
    });
  }
};

// @desc    Get feedback reviews for a specific student
// @route   GET /api/feedback/:userId
// @access  Public / Authenticated
exports.getUserFeedback = async (req, res) => {
  try {
    const { userId } = req.params;

    const feedbacks = await Feedback.find({ receiverId: userId })
      .populate('reviewerId', 'name college department profileImage')
      .sort({ createdAt: -1 });

    const avgRating =
      feedbacks.length > 0
        ? Number((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1))
        : 0;

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      averageRating: avgRating,
      feedbacks,
    });
  } catch (error) {
    console.error('getUserFeedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student feedback',
    });
  }
};
