const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Search users for tagging autocomplete
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ users: [] });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id } // Exclude current user
    })
    .select('name email')
    .limit(10);

    res.json({ users });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ message: 'Server error while searching users' });
  }
});

// Get all users (for tagging)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('name email')
      .sort({ name: 1 });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

module.exports = router;