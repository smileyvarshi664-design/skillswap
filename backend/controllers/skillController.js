const Skill = require('../models/Skill');

// @desc    Add a skill (teach or learn)
// @route   POST /api/skills
// @access  Private
exports.addSkill = async (req, res) => {
  try {
    const { skillName, category, description, type, proficiencyLevel } = req.body;

    if (!skillName || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide skill name and type (teach or learn)',
      });
    }

    if (!['teach', 'learn'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Skill type must be either "teach" or "learn"',
      });
    }

    // Check if skill already exists for this user and type
    const existing = await Skill.findOne({
      userId: req.user._id,
      skillName: { $regex: new RegExp(`^${skillName.trim()}$`, 'i') },
      type,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You have already added "${skillName}" to your ${type} skills list`,
      });
    }

    const skill = await Skill.create({
      userId: req.user._id,
      skillName: skillName.trim(),
      category: category || 'Programming',
      description: description ? description.trim() : '',
      type,
      proficiencyLevel: proficiencyLevel || (type === 'teach' ? 'Intermediate' : 'Beginner'),
    });

    res.status(201).json({
      success: true,
      skill,
      message: `Skill "${skill.skillName}" added to your ${type} list successfully!`,
    });
  } catch (error) {
    console.error('addSkill error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add skill',
    });
  }
};

// @desc    Get current user's skills
// @route   GET /api/skills/my
// @access  Private
exports.getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const teachSkills = skills.filter((s) => s.type === 'teach');
    const learnSkills = skills.filter((s) => s.type === 'learn');

    res.status(200).json({
      success: true,
      skills,
      teachSkills,
      learnSkills,
      totalTeach: teachSkills.length,
      totalLearn: learnSkills.length,
    });
  } catch (error) {
    console.error('getMySkills error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch your skills',
    });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    // Check ownership
    if (skill.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this skill',
      });
    }

    const { skillName, category, description, proficiencyLevel, type } = req.body;

    if (skillName) skill.skillName = skillName.trim();
    if (category) skill.category = category;
    if (description !== undefined) skill.description = description.trim();
    if (proficiencyLevel) skill.proficiencyLevel = proficiencyLevel;
    if (type) skill.type = type;

    await skill.save();

    res.status(200).json({
      success: true,
      skill,
      message: 'Skill updated successfully!',
    });
  } catch (error) {
    console.error('updateSkill error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update skill',
    });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    // Check ownership
    if (skill.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this skill',
      });
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully!',
    });
  } catch (error) {
    console.error('deleteSkill error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete skill',
    });
  }
};

// @desc    Explore skills, categories and statistics
// @route   GET /api/skills/explore
// @access  Public
exports.exploreSkills = async (req, res) => {
  try {
    const categories = [
      'Programming',
      'Web Development',
      'Designing',
      'Communication',
      'Photography',
      'Video Editing',
      'Marketing',
      'Data Science',
      'Languages',
      'Other',
    ];

    // Aggregation for category count
    const categoryStats = await Skill.aggregate([
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Popular skills
    const popularTeach = await Skill.aggregate([
      { $match: { type: 'teach' } },
      { $group: { _id: '$skillName', count: { $sum: 1 }, category: { $first: '$category' } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    const popularLearn = await Skill.aggregate([
      { $match: { type: 'learn' } },
      { $group: { _id: '$skillName', count: { $sum: 1 }, category: { $first: '$category' } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.status(200).json({
      success: true,
      categories,
      categoryStats,
      popularTeach,
      popularLearn,
    });
  } catch (error) {
    console.error('exploreSkills error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to explore skills',
    });
  }
};
