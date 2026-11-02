const express = require('express');
const router = express.Router();
const { createFeedback, getUserFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createFeedback);
router.get('/:userId', getUserFeedback);

module.exports = router;
