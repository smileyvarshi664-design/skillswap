const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateProfile } = require('../controllers/userController');
const { protect, optionalProtect } = require('../middleware/auth');

router.get('/', optionalProtect, getUsers);
router.put('/profile', protect, updateProfile);
router.get('/:id', optionalProtect, getUserById);

module.exports = router;
