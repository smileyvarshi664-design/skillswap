const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendRequest);
router.get('/received', protect, getReceivedRequests);
router.get('/sent', protect, getSentRequests);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);
router.put('/:id/cancel', protect, cancelRequest);

module.exports = router;
