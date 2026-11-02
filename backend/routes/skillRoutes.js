const express = require('express');
const router = express.Router();
const {
  addSkill,
  getMySkills,
  updateSkill,
  deleteSkill,
  exploreSkills,
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

router.get('/explore', exploreSkills);
router.get('/my', protect, getMySkills);
router.post('/', protect, addSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
