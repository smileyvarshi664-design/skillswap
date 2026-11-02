const Exchange = require('../models/Exchange');
const Feedback = require('../models/Feedback');

// @desc    Get all exchanges for current logged-in student
// @route   GET /api/exchanges
// @access  Private
exports.getMyExchanges = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const exchanges = await Exchange.find({
      $or: [{ studentOne: currentUserId }, { studentTwo: currentUserId }],
    })
      .populate('studentOne', 'name email college department year profileImage bio')
      .populate('studentTwo', 'name email college department year profileImage bio')
      .sort({ updatedAt: -1 });

    // Check which exchanges have feedback already submitted by current user
    const exchangeIds = exchanges.map((e) => e._id);
    const existingFeedbacks = await Feedback.find({
      exchangeId: { $in: exchangeIds },
      reviewerId: currentUserId,
    });

    const reviewedExchangeIds = new Set(existingFeedbacks.map((f) => f.exchangeId.toString()));

    // Format for frontend convenience
    const enrichedExchanges = exchanges.map((ex) => {
      const isStudentOne = ex.studentOne._id.toString() === currentUserId.toString();
      const partner = isStudentOne ? ex.studentTwo : ex.studentOne;
      const myTeachingSkill = isStudentOne ? ex.skillOne : ex.skillTwo;
      const myLearningSkill = isStudentOne ? ex.skillTwo : ex.skillOne;
      const hasReviewed = reviewedExchangeIds.has(ex._id.toString());

      return {
        _id: ex._id,
        partner,
        myTeachingSkill,
        myLearningSkill,
        status: ex.status,
        completedAt: ex.completedAt,
        createdAt: ex.createdAt,
        hasReviewed,
        raw: ex,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedExchanges.length,
      exchanges: enrichedExchanges,
    });
  } catch (error) {
    console.error('getMyExchanges error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch exchanges',
    });
  }
};

// @desc    Mark exchange as completed
// @route   PUT /api/exchanges/:id/complete
// @access  Private
exports.completeExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange not found',
      });
    }

    const currentUserId = req.user._id.toString();
    const isParticipant =
      exchange.studentOne.toString() === currentUserId ||
      exchange.studentTwo.toString() === currentUserId;

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this exchange',
      });
    }

    if (exchange.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'This exchange has already been marked as completed',
      });
    }

    exchange.status = 'Completed';
    exchange.completedAt = new Date();
    await exchange.save();

    res.status(200).json({
      success: true,
      exchange,
      message: 'Great job! Exchange marked as completed. You can now leave feedback.',
    });
  } catch (error) {
    console.error('completeExchange error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete exchange',
    });
  }
};
