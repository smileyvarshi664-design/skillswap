const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllRequests,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/requests', getAllRequests);

module.exports = router;
