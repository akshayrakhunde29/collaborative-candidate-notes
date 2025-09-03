const express = require('express');
const Message = require('../models/Message');
const Candidate = require('../models/Candidate');
const { authenticateToken } = require('../middleware/auth');
const { validateMessage } = require('../middleware/validation');
const { sanitizeInput } = require('../middleware/sanitization');

const router = express.Router();

// Get messages for a candidate
router.get('/:candidateId', authenticateToken, async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const messages = await Message.find({ candidateId })
      .populate('userId', 'name email')
      .populate('taggedUsers', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalMessages = await Message.countDocuments({ candidateId });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        hasMore: page * limit < totalMessages
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

// Create new message (this is handled by socket, but keeping for backup)
router.post('/', authenticateToken, sanitizeInput, validateMessage, async (req, res) => {
  try {
    const { candidateId, content, taggedUsers = [] } = req.body;

    // Verify candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const message = new Message({
      candidateId,
      userId: req.user._id,
      content,
      taggedUsers
    });

    await message.save();
    await message.populate([
      { path: 'userId', select: 'name email' },
      { path: 'taggedUsers', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Message created successfully',
      data: message
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error while creating message' });
  }
});

module.exports = router;